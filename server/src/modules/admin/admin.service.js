import Order from '../order/order.model.js';
import Product from '../product/product.model.js';
import Category from '../category/category.model.js';
import MtoRequest from '../mto/mto.model.js';
import BespokeEnquiry from '../bespoke/bespoke.model.js';
import AdminUser from '../auth/adminUser.model.js';
import { PAYMENT_STATUS, FULFILMENT_STATUS, MTO_STATUS, BESPOKE_STATUS, ROLES } from '../../config/constants.js';
import { ApiError } from '../../lib/ApiError.js';

export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todayOrders,
    monthOrders,
    allOrdersSummary,
    pendingFulfillments,
    activeMto,
    activeBespoke,
    lowStockProducts,
    totalProductsCount,
    totalCategoriesCount,
    recentOrders,
    recentMto,
    recentBespoke,
  ] = await Promise.all([
    // Today's paid orders
    Order.find({
      paymentStatus: PAYMENT_STATUS.PAID,
      createdAt: { $gte: startOfDay },
    }),
    // Month's paid orders
    Order.find({
      paymentStatus: PAYMENT_STATUS.PAID,
      createdAt: { $gte: startOfMonth },
    }),
    // Total revenue summary
    Order.aggregate([
      { $match: { paymentStatus: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalOrders: { $sum: 1 } } },
    ]),
    // Pending fulfillment count
    Order.countDocuments({
      paymentStatus: PAYMENT_STATUS.PAID,
      fulfilmentStatus: { $in: [FULFILMENT_STATUS.UNFULFILLED, FULFILMENT_STATUS.PROCESSING, FULFILMENT_STATUS.CONFIRMED, FULFILMENT_STATUS.IN_PRODUCTION] },
    }),
    // Active MTO
    MtoRequest.countDocuments({
      status: { $nin: [MTO_STATUS.COMPLETED, MTO_STATUS.CANCELLED, 'DELIVERED'] },
    }),
    // Active Bespoke
    BespokeEnquiry.countDocuments({
      status: { $nin: [BESPOKE_STATUS.CLOSED_WON, BESPOKE_STATUS.CLOSED_LOST, 'CLOSED'] },
    }),
    // Low stock products
    Product.find({
      availabilityStatus: { $ne: 'ARCHIVED' },
      stockQuantity: { $lte: 3 },
    }).select('name sku stockQuantity heroImage sellingPrice availabilityStatus').limit(10),
    // Total active products count
    Product.countDocuments({ availabilityStatus: { $ne: 'ARCHIVED' } }),
    // Total categories count
    Category.countDocuments({ isActive: true }),
    // Recent orders (last 6)
    Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('referenceNumber customer total paymentStatus fulfilmentStatus createdAt items'),
    // Recent MTO requests (last 5)
    MtoRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('referenceNumber customer productName status quotedPrice depositAmount createdAt preferences'),
    // Recent Bespoke inquiries (last 5)
    BespokeEnquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('referenceNumber contact jewelleryType budgetRange status occasion createdAt'),
  ]);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lifetimeRevenue = allOrdersSummary[0]?.totalRevenue || 0;
  const lifetimeOrders = allOrdersSummary[0]?.totalOrders || 0;
  const totalOrdersCount = await Order.countDocuments();

  return {
    kpis: {
      today: { revenue: todayRevenue, ordersCount: todayOrders.length },
      month: { revenue: monthRevenue, ordersCount: monthOrders.length },
      lifetime: { revenue: lifetimeRevenue, ordersCount: lifetimeOrders, totalOrdersCount },
      pendingFulfillments,
      activeMto,
      activeBespoke,
      totalProducts: totalProductsCount,
      totalCategories: totalCategoriesCount,
    },
    recentOrders,
    recentMto,
    recentBespoke,
    lowStockAlerts: lowStockProducts,
  };
}

export async function getSalesReport(query = {}) {
  const { from, to } = query;
  const match = { paymentStatus: PAYMENT_STATUS.PAID };

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const dailyTrends = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { dailyTrends };
}

// Admin Users Management
export async function listAdmins() {
  return AdminUser.find().select('-password -totpSecret -refreshTokenHash').sort({ createdAt: -1 });
}

export async function createAdmin(data) {
  const existing = await AdminUser.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict('Admin user with this email already exists');
  }

  const admin = await AdminUser.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: data.role || ROLES.STAFF,
    permissions: data.permissions || {},
  });

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
    isActive: admin.isActive,
  };
}

export async function updateAdmin(id, data) {
  const admin = await AdminUser.findById(id);
  if (!admin) {
    throw ApiError.notFound('Admin user not found');
  }

  if (data.name) admin.name = data.name;
  if (data.role) admin.role = data.role;
  if (data.isActive !== undefined) admin.isActive = data.isActive;
  if (data.permissions) admin.permissions = data.permissions;
  if (data.reset2FA) {
    admin.totpSecret = undefined;
    admin.totpEnabled = false;
  }
  if (data.password) {
    admin.password = data.password;
  }

  await admin.save();
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
    isActive: admin.isActive,
  };
}
