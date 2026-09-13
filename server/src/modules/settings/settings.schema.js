import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    whatsappNumber: z.string().optional(),
    codEnabled: z.boolean().optional(),
    codMinOrderValue: z.number().min(0).optional(),
    codMaxOrderValue: z.number().min(0).optional(),
    guestCheckoutEnabled: z.boolean().optional(),
    paymentGatewayMode: z.enum(['test', 'live']).optional(),
    gstNumber: z.string().optional(),
    gstRate: z.number().min(0).max(100).optional(),
    invoicePrefix: z.string().optional(),
    freeShippingThreshold: z.number().min(0).optional(),
    socialLinks: z.object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      pinterest: z.string().optional(),
      youtube: z.string().optional(),
    }).optional(),
    metaPixelId: z.string().optional(),
    ga4MeasurementId: z.string().optional(),
  }),
});

export const shippingRuleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    zone: z.string().min(1, 'Zone is required'),
    charge: z.number().min(0, 'Charge must be non-negative'),
    freeThreshold: z.number().min(0).default(0),
    isActive: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
  }),
});

export const updateShippingRuleSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: shippingRuleSchema.shape.body.partial(),
});
