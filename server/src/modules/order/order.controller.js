import * as orderService from './order.service.js';
import { verifyPaymentSignature } from '../../services/payment.service.js';
import Order from './order.model.js';
import { PAYMENT_STATUS } from '../../config/constants.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import { ApiError } from '../../lib/ApiError.js';
import catchAsync from '../../lib/catchAsync.js';
import logger from '../../lib/logger.js';

export const initiateCheckout = catchAsync(async (req, res) => {
  const result = await orderService.initiateCheckout(req.body);
  ApiResponse.created(res, result, 'Order initiated');
});

/**
 * POST /api/v1/orders/verify-payment
 * Called by the client after Razorpay checkout modal succeeds.
 * Verifies the HMAC signature on the server — the ONLY trusted way to confirm payment.
 * Never trust the client's "payment success" callback alone.
 */
export const verifyPayment = catchAsync(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw ApiError.badRequest('Missing payment verification fields');
  }

  // Cryptographic signature verification — prevents tampered / fake payments
  const isValid = verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    // Mark the order as FAILED if signature is invalid
    await Order.findOneAndUpdate(
      { razorpayOrderId, paymentStatus: PAYMENT_STATUS.PENDING },
      { paymentStatus: PAYMENT_STATUS.FAILED }
    );
    logger.warn(`Invalid payment signature attempted for razorpayOrderId: ${razorpayOrderId}`);
    throw ApiError.unauthorized('Payment signature verification failed — possible tampering detected');
  }

  // Find and confirm the order
  const order = await Order.findOne({ razorpayOrderId });
  if (!order) throw ApiError.notFound('Order not found for this payment');

  // Idempotency — don't re-confirm if already paid (handles duplicate callbacks)
  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    return ApiResponse.ok(res, { referenceNumber: order.referenceNumber }, 'Payment already confirmed');
  }

  const confirmedOrder = await orderService.confirmOrder(
    order._id,
    razorpayOrderId,
    razorpayPaymentId,
    'ONLINE'
  );

  logger.info(`Payment verified & order confirmed: ${confirmedOrder.referenceNumber}`);
  ApiResponse.ok(res, { referenceNumber: confirmedOrder.referenceNumber }, 'Payment verified');
});

/**
 * POST /api/v1/orders/payment-failed
 * Called by the client when the Razorpay modal reports a failure.
 * Marks the order FAILED server-side so the stock hold is released immediately
 * rather than waiting for the TTL cron.
 */
export const markPaymentFailed = catchAsync(async (req, res) => {
  const { razorpayOrderId, reason } = req.body;

  if (!razorpayOrderId) throw ApiError.badRequest('razorpayOrderId is required');

  await Order.findOneAndUpdate(
    { razorpayOrderId, paymentStatus: PAYMENT_STATUS.PENDING },
    { paymentStatus: PAYMENT_STATUS.FAILED, $unset: { reservedUntil: 1 } }
  );

  logger.info(`Payment marked as failed for razorpayOrderId: ${razorpayOrderId}. Reason: ${reason || 'user_dismissed'}`);
  ApiResponse.ok(res, null, 'Payment failure recorded');
});

export const getOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByRef(req.params.ref);
  ApiResponse.ok(res, {
    referenceNumber: order.referenceNumber,
    paymentStatus: order.paymentStatus,
    fulfilmentStatus: order.fulfilmentStatus,
    trackingLink: order.trackingLink,
    items: order.items,
    total: order.total,
    createdAt: order.createdAt,
  });
});

export const listOrders = catchAsync(async (req, res) => {
  const result = await orderService.listOrders(req.query);
  ApiResponse.ok(res, result.orders, 'OK', result.pagination);
});

export const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByRef(req.params.ref);
  ApiResponse.ok(res, order);
});

export const updateOrder = catchAsync(async (req, res) => {
  const { note, ...statusUpdates } = req.body;

  let order;
  if (note) {
    order = await orderService.addAdminNote(req.params.id, note, req.user.name);
  } else {
    order = await orderService.updateOrderStatus(req.params.id, statusUpdates);
  }

  ApiResponse.ok(res, order, 'Order updated');
});

export const getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id, req.user.email);
  ApiResponse.ok(res, orders);
});
