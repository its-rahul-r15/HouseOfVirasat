import jwt from 'jsonwebtoken';
import { ApiError } from '../lib/ApiError.js';
import { env } from '../config/env.js';
import AdminUser from '../modules/auth/adminUser.model.js';
import User from '../modules/auth/user.model.js';
import catchAsync from '../lib/catchAsync.js';

export const authenticate = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  let user = await AdminUser.findById(decoded.id).select('-password -refreshTokenHash -totpSecret');
  if (!user) {
    user = await User.findById(decoded.id).select('-password');
  }

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User account not found or inactive');
  }

  req.user = user;
  next();
});
