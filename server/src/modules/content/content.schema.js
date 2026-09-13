import { z } from 'zod';

export const contentBlockSchema = z.object({
  body: z.object({
    key: z.string().min(1, 'Key is required'),
    type: z.enum(['BANNER', 'SECTION', 'PAGE', 'FAQ', 'JOURNAL']),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    body: z.string().optional(),
    images: z.array(z.object({
      url: z.string().url(),
      altText: z.string().optional(),
      link: z.string().optional(),
    })).optional(),
    ctaLabel: z.string().optional(),
    ctaLink: z.string().optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
    meta: z.record(z.any()).optional(),
  }),
});

export const updateContentBlockSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: contentBlockSchema.shape.body.partial(),
});

export const notificationTemplateSchema = z.object({
  body: z.object({
    key: z.string().min(1, 'Key is required'),
    name: z.string().min(1, 'Name is required'),
    subject: z.string().optional(),
    body: z.string().min(1, 'Body is required'),
    availableTokens: z.array(z.string()).optional(),
    channel: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']).default('EMAIL'),
    isActive: z.boolean().default(true),
  }),
});

export const updateNotificationTemplateSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: notificationTemplateSchema.shape.body.partial(),
});
