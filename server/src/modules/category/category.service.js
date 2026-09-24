import Category from './category.model.js';
import Collection from './collection.model.js';
import { ApiError } from '../../lib/ApiError.js';
import { generateSitemap } from '../../services/sitemap.service.js';
import { processUpload, deleteFile, UPLOAD_SUBDIRS } from '../../services/image.service.js';

// ─── Category Services ─────────────────────────────────────────────────────

export async function listCategories(admin = false) {
  const filter = admin ? {} : { isActive: true };
  return Category.find(filter).populate('parent', 'name slug').sort({ displayOrder: 1, name: 1 });
}

export async function getCategoryBySlug(slug) {
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  return category;
}

export async function createCategory(data) {
  const existing = await Category.findOne({ slug: data.slug });
  if (existing) {
    throw ApiError.conflict('Category with this slug already exists');
  }

  const category = await Category.create(data);
  generateSitemap().catch(() => {});
  return category;
}

export async function updateCategory(id, data) {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  generateSitemap().catch(() => {});
  return category;
}

export async function deleteCategory(id) {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  generateSitemap().catch(() => {});
  return { id };
}

/**
 * Upload / replace a category's banner/thumbnail image.
 * Old image is deleted from R2 to avoid orphaned objects.
 */
export async function uploadCategoryImage(id, file) {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound('Category not found');

  // Delete old image if one exists
  if (category.image) {
    deleteFile(category.image).catch(() => {});
  }

  const { url } = await processUpload(file.buffer, UPLOAD_SUBDIRS.CATEGORIES);
  category.image = url;
  await category.save();
  return category;
}

// ─── Collection Services ───────────────────────────────────────────────────

export async function listCollections(admin = false) {
  const filter = admin ? {} : { isActive: true };
  return Collection.find(filter).sort({ displayOrder: 1, name: 1 });
}

export async function getCollectionBySlug(slug) {
  const collection = await Collection.findOne({ slug, isActive: true });
  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }
  return collection;
}

export async function createCollection(data) {
  const existing = await Collection.findOne({ slug: data.slug });
  if (existing) {
    throw ApiError.conflict('Collection with this slug already exists');
  }

  const collection = await Collection.create(data);
  generateSitemap().catch(() => {});
  return collection;
}

export async function updateCollection(id, data) {
  const collection = await Collection.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }
  generateSitemap().catch(() => {});
  return collection;
}

export async function deleteCollection(id) {
  const collection = await Collection.findByIdAndDelete(id);
  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }
  generateSitemap().catch(() => {});
  return { id };
}

/**
 * Upload / replace a collection's banner image.
 */
export async function uploadCollectionImage(id, file) {
  const collection = await Collection.findById(id);
  if (!collection) throw ApiError.notFound('Collection not found');

  if (collection.image) {
    deleteFile(collection.image).catch(() => {});
  }

  const { url } = await processUpload(file.buffer, UPLOAD_SUBDIRS.COLLECTIONS);
  collection.image = url;
  await collection.save();
  return collection;
}
