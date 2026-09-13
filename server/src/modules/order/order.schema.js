import { z } from 'zod';

const addressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  country: z.string().default('India'),
  phone: z.string().optional(),
});

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(1),
      mobile: z.string().regex(/^\d{10}$/, 'Invalid mobile number'),
      email: z.string().email(),
    }),
    shippingAddress: addressSchema,
    billingAddress: addressSchema.optional(),
    items: z.array(z.object({
      productId: z.string().min(1),
      variantId: z.string().optional(),
      sku: z.string().min(1),
      qty: z.number().int().min(1),
    })).min(1),
    couponCode: z.string().optional(),
    paymentMethod: z.enum(['ONLINE', 'COD']).default('ONLINE'),
    shippingRuleId: z.string().optional(),
  }),
});

export const updateOrderSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    paymentStatus: z.string().optional(),
    fulfilmentStatus: z.string().optional(),
    trackingLink: z.string().url().optional(),
    courierPartner: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const listOrdersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    paymentStatus: z.string().optional(),
    fulfilmentStatus: z.string().optional(),
    search: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }),
});
