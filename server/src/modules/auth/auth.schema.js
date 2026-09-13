import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
    totpCode: z.string().optional(),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(6).max(20).optional(),
    password: z.string().min(6).max(100),
    anniversary: z.string().optional(),
    birthday: z.string().optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().min(6).max(20).optional(),
    anniversary: z.string().optional(),
    birthday: z.string().optional(),
    addresses: z.array(z.any()).optional(),
  }),
});

export const refreshSchema = z.object({
  body: z.object({}),
});

export const createAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['SUPER_ADMIN', 'STAFF']).default('STAFF'),
    permissions: z.object({
      manageProducts: z.boolean().default(false),
      manageOrders: z.boolean().default(false),
      manageMto: z.boolean().default(false),
      manageBespoke: z.boolean().default(false),
      manageContent: z.boolean().default(false),
      manageCoupons: z.boolean().default(false),
      manageSettings: z.boolean().default(false),
      viewReports: z.boolean().default(false),
      viewCustomers: z.boolean().default(false),
      manageUsers: z.boolean().default(false),
    }).default({}),
  }),
});
