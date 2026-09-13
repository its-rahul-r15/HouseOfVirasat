import Coupon from './coupon.model.js';
import { ApiError } from '../../lib/ApiError.js';

export async function validateCoupon(code, orderValue) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (!coupon) {
    throw ApiError.badRequest('Invalid coupon code');
  }

  const check = coupon.isValid(orderValue);
  if (!check.valid) {
    throw ApiError.badRequest(check.reason);
  }

  const discount = coupon.calculateDiscount(orderValue);

  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount: Math.round(discount),
    finalAmount: Math.max(0, Math.round(orderValue - discount)),
  };
}

export async function createCoupon(data) {
  const existing = await Coupon.findOne({ code: data.code.toUpperCase().trim() });
  if (existing) {
    throw ApiError.conflict(`Coupon code '${data.code}' already exists`);
  }

  const coupon = await Coupon.create({
    ...data,
    code: data.code.toUpperCase().trim(),
  });

  return coupon;
}

export async function getCouponById(id) {
  const coupon = await Coupon.findById(id).populate('applicableCategories', 'name slug');
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }
  return coupon;
}

export async function listCoupons(query = {}) {
  const { page = 1, limit = 20, isActive, search } = query;
  const filter = {};

  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.code = { $regex: search, $options: 'i' };
  }

  const [items, total] = await Promise.all([
    Coupon.find(filter)
      .populate('applicableCategories', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Coupon.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateCoupon(id, updateData) {
  const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }
  return coupon;
}

export async function deleteCoupon(id) {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }
  return { id };
}
