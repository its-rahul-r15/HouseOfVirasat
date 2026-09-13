import { ApiError } from '../lib/ApiError.js';

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) throw ApiError.unauthorized();
  if (!roles.includes(req.user.role)) throw ApiError.forbidden('Insufficient role');
  next();
};

const PERMISSION_MAP = {
  view_orders: 'manageOrders',
  edit_orders: 'manageOrders',
  view_products: 'manageProducts',
  edit_products: 'manageProducts',
  view_settings: 'manageSettings',
  edit_settings: 'manageSettings',
  edit_content: 'manageContent',
  manage_admins: 'manageUsers',
  view_analytics: 'viewReports',
};

export const requirePermission = (permission) => (req, res, next) => {
  if (!req.user) throw ApiError.unauthorized();
  if (req.user.role === 'SUPER_ADMIN') return next();

  const mappedKey = PERMISSION_MAP[permission] || permission;
  if (!req.user.permissions?.[mappedKey] && !req.user.permissions?.[permission]) {
    throw ApiError.forbidden(`Missing permission: ${permission}`);
  }
  next();
};
