import * as adminService from './admin.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

export const getDashboard = catchAsync(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  ApiResponse.ok(res, stats);
});

export const getSalesReport = catchAsync(async (req, res) => {
  const report = await adminService.getSalesReport(req.query);
  ApiResponse.ok(res, report);
});

export const listAdmins = catchAsync(async (req, res) => {
  const admins = await adminService.listAdmins();
  ApiResponse.ok(res, admins);
});

export const createAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  ApiResponse.created(res, admin, 'Admin user created');
});

export const updateAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.updateAdmin(req.params.id, req.body);
  ApiResponse.ok(res, admin, 'Admin user updated');
});
