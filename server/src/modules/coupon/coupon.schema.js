import { z } from 'zod';
import { COUPON_TYPE } from '../../config/constants.js';

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    orderValue: z.number().nonnegative('Order value must be non-negative'),
  }),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required').toUpperCase(),
    type: z.enum(Object.values(COUPON_TYPE)),
    value: z.number().positive('Value must be positive'),
    minOrderValue: z.number().min(0).default(0),
    maxDiscountAmount: z.number().positive().optional(),
    usageLimit: z.number().int().min(1).default(1),
    validFrom: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
    validTo: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
    applicableCategories: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateCouponSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    type: z.enum(Object.values(COUPON_TYPE)).optional(),
    value: z.number().positive().optional(),
    minOrderValue: z.number().min(0).optional(),
    maxDiscountAmount: z.number().positive().nullable().optional(),
    usageLimit: z.number().int().min(1).optional(),
    validFrom: z.string().optional(),
    validTo: z.string().optional(),
    applicableCategories: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const listCouponsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
  }),
});
