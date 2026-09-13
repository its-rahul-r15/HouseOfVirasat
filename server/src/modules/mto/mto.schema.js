import { z } from 'zod';
import { MTO_STATUS } from '../../config/constants.js';

export const createMtoSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    customer: z.object({
      name: z.string().min(1, 'Name is required'),
      mobile: z.string().regex(/^\d{10}$/, 'Invalid mobile number'),
      email: z.string().email('Invalid email address'),
    }),
    selectedVariant: z.string().optional(),
    preferences: z.string().optional(),
  }),
});

export const updateMtoStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(Object.values(MTO_STATUS)).optional(),
    quotedPrice: z.number().positive().optional(),
    depositAmount: z.number().positive().optional(),
    depositPercent: z.number().min(0).max(100).optional(),
    note: z.string().optional(),
  }),
});

export const listMtoSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.string().optional(),
    search: z.string().optional(),
  }),
});
