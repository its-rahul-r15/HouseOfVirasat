import Order from './order.model.js';
import Product from '../product/product.model.js';
import Coupon from '../coupon/coupon.model.js';
import ShippingRule from '../settings/shippingRule.model.js';
import { getSettings } from '../settings/appSettings.model.js';
import { createPaymentOrder } from '../../services/payment.service.js';
import { sendEmail } from '../../services/notification.service.js';
import { ApiError } from '../../lib/ApiError.js';
import { ORDER_STATUS, STOCK_HOLD_TTL_MS } from '../../config/constants.js';
import logger from '../../lib/logger.js';

export async function initiateCheckout({ customer, shippingAddress, billingAddress, items, couponCode, paymentMethod, shippingRuleId }) {
  const settings = await getSettings();

  // Guest checkout — honour admin toggle
  if (customer.guestCheckout && !settings.guestCheckoutEnabled) {
    throw ApiError.badRequest('Guest checkout is currently disabled. Please create an account to continue.');
  }

  if (paymentMethod === 'COD' && !settings.codEnabled) {
    throw ApiError.badRequest('Cash on delivery is not available');
  }

  // Validate items and calculate subtotal
  const resolvedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw ApiError.badRequest(`Product not found: ${item.productId}`);

    if (product.availabilityStatus === 'ARCHIVED' || product.availabilityStatus === 'SOLD_OUT') {
      throw ApiError.badRequest(`${product.name} is not available for purchase`);
    }

    if (product.availabilityStatus === 'IN_STOCK' && product.stockQuantity < item.qty) {
      throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
    }

    const price = product.sellingPrice || 0;
    resolvedItems.push({
      productId: product._id,
      sku: item.sku,
      name: product.name,
      qty: item.qty,
      priceAtPurchase: price,
      priceMode: product.priceMode,
    });
    subtotal += price * item.qty;
  }

  // Shipping charge
  let shippingCharge = 0;
  if (shippingRuleId) {
    const rule = await ShippingRule.findById(shippingRuleId);
    if (rule) {
      shippingCharge = subtotal >= rule.freeThreshold ? 0 : rule.charge;
    }
  }

  // Coupon validation
  let discountApplied = 0;
  let appliedCouponCode = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) throw ApiError.badRequest('Invalid coupon code');

    const validity = coupon.isValid(subtotal);
    if (!validity.valid) throw ApiError.badRequest(validity.reason);

    discountApplied = coupon.calculateDiscount(subtotal);
    appliedCouponCode = coupon.code;
  }

  const total = Math.max(0, subtotal + shippingCharge - discountApplied);

  // COD max-order-value — admin-configurable, enforced server-side
  if (paymentMethod === 'COD') {
    const codMax = settings.codMaxOrderValue ?? 50000;
    if (total > codMax) {
      throw ApiError.badRequest(
        `Cash on Delivery is not available for orders above ₹${codMax.toLocaleString('en-IN')}. Please use online payment.`
      );
    }
  }

  // Create order in PENDING state
  const order = await Order.create({
    customer,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    items: resolvedItems,
    subtotal,
    shippingCharge,
    discountApplied,
    couponCode: appliedCouponCode,
    total,
    paymentStatus: ORDER_STATUS.PENDING,
    reservedUntil: new Date(Date.now() + STOCK_HOLD_TTL_MS),
  });

  if (paymentMethod === 'ONLINE') {
    const razorpayOrder = await createPaymentOrder({
      amount: total,
      receipt: order.referenceNumber,
      notes: { orderId: order._id.toString() },
    });

    await Order.findByIdAndUpdate(order._id, { razorpayOrderId: razorpayOrder.id });
    return { order, razorpayOrder };
  }

  // COD — confirm immediately
  await confirmOrder(order._id, null, null, 'COD');
  return { order: await Order.findById(order._id) };
}

export async function confirmOrder(orderId, razorpayOrderId, razorpayPaymentId, method = 'ONLINE') {
  // BUG FIX: Atomic lock — use findOneAndUpdate to claim the PENDING→PAID transition.
  // Previously, this function read the order status and then updated it in two separate steps.
  // Under concurrent calls (client callback + Razorpay webhook arriving simultaneously), both
  // could read PENDING, pass the check, and call this function twice → double stock decrement,
  // double coupon usage, two invoice numbers generated.
  // Now only ONE caller wins the atomic update; the other gets null and returns safely.
  const lockedOrder = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: ORDER_STATUS.PENDING },
    { $set: { paymentStatus: ORDER_STATUS.PAID } },
    { new: false } // return the ORIGINAL doc so we know we were the ones who changed it
  );

  if (!lockedOrder) {
    // Either order doesn't exist, or it was already claimed by another concurrent call
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) throw ApiError.notFound('Order not found');
    if (existingOrder.paymentStatus === ORDER_STATUS.PAID) {
      logger.info(`confirmOrder: order ${orderId} already PAID — concurrent call ignored (race condition prevented)`);
      return existingOrder;
    }
    throw ApiError.badRequest(`Cannot confirm order in status: ${existingOrder.paymentStatus}`);
  }

  // We won the atomic lock — proceed with stock, coupon, invoice operations
  const order = await Order.findById(orderId).populate('items.productId');

  // Decrement stock — only on payment confirmation, never before.
  // Use findByIdAndUpdate (not .save()) to avoid full document re-validation,
  // which would reject products with legacy enum values in unrelated fields.
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (product && product.availabilityStatus === 'IN_STOCK') {
      const newQty = Math.max(0, product.stockQuantity - item.qty);
      // Replicate the auto-status pre-save hook logic inline
      let newStatus;
      if (newQty > 0) {
        newStatus = 'IN_STOCK';
      } else if (product.madeToOrderAllowed) {
        newStatus = 'MADE_TO_ORDER';
      } else {
        newStatus = 'SOLD_OUT';
      }
      await Product.findByIdAndUpdate(product._id, {
        $set: { stockQuantity: newQty, availabilityStatus: newStatus },
      }, { runValidators: false });
    }
  }

  // Increment coupon usage
  if (order.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: order.couponCode },
      { $inc: { usedCount: 1 } },
    );
  }

  const invoiceNumber = await generateInvoiceNumber();

  await Order.findByIdAndUpdate(orderId, {
    paymentGatewayRef: razorpayPaymentId,
    invoiceNumber,
    $unset: { reservedUntil: 1 },
  });

  const updatedOrder = await Order.findById(orderId);

  sendEmail('order_confirmation', order.customer.email, {
    customerName: order.customer.name,
    orderRef: order.referenceNumber,
    total: order.total,
    items: order.items.map((i) => `${i.name} × ${i.qty}`).join(', '),
  }).catch((err) => logger.error('Order confirmation email failed:', err.message));

  return updatedOrder;
}

async function generateInvoiceNumber() {
  const { getSettings } = await import('../settings/appSettings.model.js');
  const AppSettings = (await import('../settings/appSettings.model.js')).default;

  const settings = await AppSettings.findOneAndUpdate(
    { _singleton: 'settings' },
    { $inc: { invoiceCounter: 1 } },
    { new: true, upsert: true },
  );

  return `${settings.invoicePrefix}-${String(settings.invoiceCounter).padStart(5, '0')}`;
}

export async function listOrders({ page, limit, paymentStatus, fulfilmentStatus, search, from, to }) {
  const filter = {};

  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (fulfilmentStatus) filter.fulfilmentStatus = fulfilmentStatus;

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  if (search) {
    filter.$or = [
      { referenceNumber: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.email': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  return { orders, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getOrderByRef(referenceNumber) {
  const order = await Order.findOne({ referenceNumber });
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function updateOrderStatus(id, updates) {
  const order = await Order.findByIdAndUpdate(id, updates, { new: true });
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function addAdminNote(id, note, adminName) {
  const order = await Order.findByIdAndUpdate(
    id,
    { $push: { adminNotes: { note, addedBy: adminName } } },
    { new: true },
  );
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function releaseExpiredHolds() {
  const expired = await Order.find({
    paymentStatus: ORDER_STATUS.PENDING,
    reservedUntil: { $lt: new Date() },
  });

  for (const order of expired) {
    await Order.findByIdAndUpdate(order._id, {
      paymentStatus: ORDER_STATUS.FAILED,
      $unset: { reservedUntil: 1 },
    });
    logger.info(`Released stock hold for expired order: ${order.referenceNumber}`);
  }

  return expired.length;
}

export async function getMyOrders(userId, email) {
  const conditions = [];
  if (userId) conditions.push({ 'customer.userId': userId });
  if (email) conditions.push({ 'customer.email': email.toLowerCase().trim() });

  if (conditions.length === 0) return [];

  const orders = await Order.find({ $or: conditions })
    .sort({ createdAt: -1 })
    .populate('items.productId', 'name heroImage gallery priceMode purity metalType');

  return orders;
}
