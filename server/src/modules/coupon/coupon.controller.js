import * as couponService from './coupon.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

export const validateCoupon = catchAsync(async (req, res) => {
  const result = await couponService.validateCoupon(req.body.code, req.body.orderValue);
  ApiResponse.ok(res, result, 'Coupon applied successfully');
});

export const listCoupons = catchAsync(async (req, res) => {
  const result = await couponService.listCoupons(req.query);
  ApiResponse.ok(res, result.items, 'OK', result.pagination);
});

export const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  ApiResponse.created(res, coupon, 'Coupon created');
});

export const getCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.getCouponById(req.params.id);
  ApiResponse.ok(res, coupon);
});

export const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  ApiResponse.ok(res, coupon, 'Coupon updated');
});

export const deleteCoupon = catchAsync(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  ApiResponse.ok(res, null, 'Coupon deleted');
});
