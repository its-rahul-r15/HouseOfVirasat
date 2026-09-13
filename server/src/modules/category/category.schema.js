import { z } from 'zod';

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: z.string().optional(),
    image: z.object({
      url: z.string().url().optional(),
      altText: z.string().optional(),
    }).optional(),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
    parent: z.string().nullable().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: categorySchema.shape.body.partial(),
});

export const collectionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: z.string().optional(),
    heroImage: z.object({
      url: z.string().url().optional(),
      altText: z.string().optional(),
    }).optional(),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

export const updateCollectionSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: collectionSchema.shape.body.partial(),
});
