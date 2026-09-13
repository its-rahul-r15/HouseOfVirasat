import * as authService from './auth.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';
import { env } from '../../config/env.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerCustomer(req.body);
  res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
  ApiResponse.created(res, { accessToken: result.accessToken, user: result.user }, 'Patron account created successfully');
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);

  if (result.requires2FA) {
    return ApiResponse.ok(res, { requires2FA: true }, '2FA verification required');
  }

  res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
  ApiResponse.ok(res, { accessToken: result.accessToken, user: result.user }, 'Login successful');
});

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  ApiResponse.ok(res, { user });
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  ApiResponse.ok(res, { user }, 'Profile updated successfully');
});

export const refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await authService.refreshAccessToken(refreshToken);
  ApiResponse.ok(res, result);
});

export const logout = catchAsync(async (req, res) => {
  await authService.logoutUser(req.user._id);
  res.clearCookie('refreshToken');
  ApiResponse.ok(res, null, 'Logged out successfully');
});

export const setup2FA = catchAsync(async (req, res) => {
  const result = await authService.setup2FA(req.user._id);
  ApiResponse.ok(res, result, 'Scan the QR code in your authenticator app');
});

export const verify2FA = catchAsync(async (req, res) => {
  const { code } = req.body;
  const result = await authService.verify2FA(req.user._id, code);
  ApiResponse.ok(res, result);
});
