import { z } from 'zod';
import { BESPOKE_STATUS } from '../../config/constants.js';

export const createBespokeSchema = z.object({
  body: z.object({
    contact: z.object({
      name: z.string().min(1, 'Name is required'),
      mobile: z.string().regex(/^\d{10}$/, 'Invalid mobile number'),
      email: z.string().email('Invalid email address'),
      city: z.string().optional(),
    }),
    jewelleryType: z.string().optional(),
    metalPreference: z.string().optional(),
    karatPreference: z.array(z.enum(['9K', '14K', '18K', '22K'])).optional(),
    stonePreference: z.string().optional(),
    budgetRange: z.string().optional(),
    occasion: z.string().optional(),
    timeline: z.string().optional(),
    designBrief: z.string().optional(),
    preferredContactMethod: z.enum(['PHONE', 'EMAIL', 'WHATSAPP']).default('WHATSAPP'),
    appointmentRequested: z.boolean().default(false),
  }),
});

export const updateBespokeSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(Object.values(BESPOKE_STATUS)).optional(),
    note: z.string().optional(),
  }),
});

export const listBespokeSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.string().optional(),
    search: z.string().optional(),
  }),
});
