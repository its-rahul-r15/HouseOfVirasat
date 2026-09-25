import mongoose from 'mongoose';
import Product from './product.model.js';
import Category from '../category/category.model.js';
import Collection from '../category/collection.model.js';
import { ApiError } from '../../lib/ApiError.js';
import { processUpload, processVideoUpload, deleteFile, UPLOAD_SUBDIRS } from '../../services/image.service.js';
import { generateSitemap } from '../../services/sitemap.service.js';
import { PRODUCT_STATUS } from '../../config/constants.js';

async function resolveCategoryId(categoryInput) {
  if (!categoryInput) {
    const defaultCat = await Category.findOne();
    return defaultCat ? defaultCat._id : undefined;
  }
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    return categoryInput;
  }
  const cleanStr = String(categoryInput).trim();
  const found = await Category.findOne({
    $or: [
      { slug: cleanStr.toLowerCase() },
      { name: new RegExp(`^${cleanStr}$`, 'i') },
    ],
  });
  if (found) return found._id;

  // Fallback to first available category
  const fallbackCat = await Category.findOne();
  return fallbackCat ? fallbackCat._id : undefined;
}

async function resolveCollectionIds(collectionInput) {
  if (!collectionInput) return [];
  const items = Array.isArray(collectionInput) ? collectionInput : [collectionInput];
  const ids = [];

  for (const item of items) {
    if (!item) continue;
    if (mongoose.Types.ObjectId.isValid(item)) {
      ids.push(item);
      continue;
    }
    const cleanStr = String(item).trim();
    const found = await Collection.findOne({
      $or: [
        { slug: cleanStr.toLowerCase() },
        { name: new RegExp(`^${cleanStr}$`, 'i') },
      ],
    });
    if (found) {
      ids.push(found._id);
    }
  }

  return ids;
}

export async function listProducts({ page = 1, limit = 50, category, collection, metalType, priceMode, priceMin, priceMax, availabilityStatus, sort = 'newest', search, isFeatured, featured }) {
  const andClauses = [];

  const featuredFlag = isFeatured !== undefined ? isFeatured : featured;
  if (featuredFlag !== undefined) {
    andClauses.push({ isFeatured: Boolean(featuredFlag) });
  }

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      andClauses.push({ category });
    } else {
      const cleanCat = category.toLowerCase().trim();
      const singularCat = cleanCat.endsWith('s') ? cleanCat.slice(0, -1) : cleanCat;
      const pluralCat = cleanCat.endsWith('s') ? cleanCat : `${cleanCat}s`;

      const foundCats = await Category.find({
        $or: [
          { slug: { $in: [cleanCat, singularCat, pluralCat] } },
          { name: new RegExp(`^(${cleanCat}|${singularCat}|${pluralCat})$`, 'i') },
          { slug: new RegExp(cleanCat, 'i') },
          { name: new RegExp(cleanCat, 'i') },
          { slug: new RegExp(singularCat, 'i') },
          { name: new RegExp(singularCat, 'i') },
        ],
      });

      const catIds = foundCats.map((c) => c._id);
      if (catIds.length > 0) {
        andClauses.push({
          $or: [
            { category: { $in: catIds } },
            { tags: { $in: [cleanCat, singularCat, pluralCat] } },
            { name: { $regex: cleanCat, $options: 'i' } },
            { name: { $regex: singularCat, $options: 'i' } },
          ],
        });
      } else {
        andClauses.push({
          $or: [
            { tags: { $in: [cleanCat, singularCat, pluralCat] } },
            { name: { $regex: cleanCat, $options: 'i' } },
            { name: { $regex: singularCat, $options: 'i' } },
            { subcategory: { $regex: cleanCat, $options: 'i' } },
          ],
        });
      }
    }
  }

  if (collection) {
    if (mongoose.Types.ObjectId.isValid(collection)) {
      andClauses.push({ collection });
    } else {
      const foundCol = await Collection.findOne({
        $or: [
          { slug: collection.toLowerCase() },
          { name: new RegExp(`^${collection}$`, 'i') },
        ],
      });
      if (foundCol) {
        andClauses.push({ collection: foundCol._id });
      }
    }
  }

  if (metalType) andClauses.push({ metalType });
  if (priceMode) andClauses.push({ priceMode });

  if (availabilityStatus) {
    andClauses.push({ availabilityStatus });
  } else {
    andClauses.push({ availabilityStatus: { $ne: PRODUCT_STATUS.ARCHIVED } });
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    const priceFilter = {};
    if (priceMin !== undefined) priceFilter.$gte = Number(priceMin);
    if (priceMax !== undefined) priceFilter.$lte = Number(priceMax);
    andClauses.push({ sellingPrice: priceFilter });
  }

  if (search && search.trim()) {
    const cleanSearch = search.trim();
    andClauses.push({
      $or: [
        { name: { $regex: cleanSearch, $options: 'i' } },
        { sku: { $regex: cleanSearch, $options: 'i' } },
        { urlHandle: { $regex: cleanSearch, $options: 'i' } },
      ],
    });
  }

  const filter = andClauses.length > 0 ? { $and: andClauses } : {};

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { sellingPrice: 1 },
    price_desc: { sellingPrice: -1 },
    name_asc: { name: 1 },
  };

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 50);
  const skip = (safePage - 1) * safeLimit;
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate('category', 'name slug')
      .populate('collection', 'name slug')
      .select('-costPrice -supplierRef -batchRef'),
    Product.countDocuments(filter),
  ]);

  return {
    products: products.map((p) => p.toPublicJSON()),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getProductByHandle(urlHandle) {
  const query = mongoose.Types.ObjectId.isValid(urlHandle)
    ? { $or: [{ urlHandle }, { _id: urlHandle }] }
    : { urlHandle };

  const product = await Product.findOne(query)
    .populate('category', 'name slug')
    .populate('collection', 'name slug');

  if (!product) throw ApiError.notFound('Product not found');
  return product.toPublicJSON();
}

export async function getProductById(id) {
  const product = await Product.findById(id)
    .populate('category', 'name slug')
    .populate('collection', 'name slug');

  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export async function createProduct(data, adminId) {
  const payload = { ...data };

  if (!payload.urlHandle && payload.name) {
    payload.urlHandle = payload.name.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (payload.category) {
    payload.category = await resolveCategoryId(payload.category);
  }
  if (payload.collection) {
    payload.collection = await resolveCollectionIds(payload.collection);
  }

  const existing = await Product.findOne({
    $or: [{ sku: payload.sku }, { urlHandle: payload.urlHandle }],
  });

  if (existing) {
    const field = existing.sku === payload.sku ? 'SKU' : 'URL handle';
    throw ApiError.conflict(`${field} already exists`);
  }

  const product = await Product.create({ ...payload, createdBy: adminId });
  generateSitemap().catch(() => {});
  return product;
}

export async function updateProduct(id, data) {
  const payload = { ...data };

  if (payload.category) {
    payload.category = await resolveCategoryId(payload.category);
  }
  if (payload.collection) {
    payload.collection = await resolveCollectionIds(payload.collection);
  }

  const product = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!product) throw ApiError.notFound('Product not found');
  generateSitemap().catch(() => {});
  return product;
}

export async function archiveProduct(id, redirectTo = null) {
  const product = await Product.findByIdAndUpdate(
    id,
    { availabilityStatus: PRODUCT_STATUS.ARCHIVED, archivedAt: new Date() },
    { new: true },
  );
  if (!product) throw ApiError.notFound('Product not found');
  generateSitemap().catch(() => {});
  return product;
}

export async function duplicateProduct(id, adminId) {
  const source = await Product.findById(id).lean();
  if (!source) throw ApiError.notFound('Product not found');

  const { _id, sku, urlHandle, referenceNumber, createdAt, updatedAt, ...rest } = source;

  const copy = await Product.create({
    ...rest,
    sku: `${sku}-COPY-${Date.now()}`,
    urlHandle: `${urlHandle}-copy-${Date.now()}`,
    name: `${source.name} (Copy)`,
    availabilityStatus: PRODUCT_STATUS.ARCHIVED,
    stockQuantity: 0,
    createdBy: adminId,
  });

  return copy;
}

export async function addProductImages(id, files) {
  const processedImages = await Promise.all(
    files.map((file) => processUpload(file.buffer, UPLOAD_SUBDIRS.PRODUCTS)),
  );

  const galleryEntries = processedImages.map((img) => ({ url: img.url, altText: '' }));
  const product = await Product.findByIdAndUpdate(
    id,
    { $push: { gallery: { $each: galleryEntries } } },
    { new: true },
  );

  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export async function removeProductImage(id, imageUrl) {
  const product = await Product.findByIdAndUpdate(
    id,
    { $pull: { gallery: { url: imageUrl } } },
    { new: true },
  );
  if (!product) throw ApiError.notFound('Product not found');
  deleteFile(imageUrl).catch(() => {});
  return product;
}

export async function processStandaloneUploads(files) {
  const processedImages = await Promise.all(
    files.map((file) => processUpload(file.buffer, UPLOAD_SUBDIRS.PRODUCTS))
  );
  return processedImages;
}

export async function updateStockQuantity(id, quantity) {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  product.stockQuantity = quantity;
  await product.save(); // triggers pre-save hook for status transition
  return product;
}

/**
 * Upload / replace the product video.
 * Old video is deleted from R2 before new one is stored.
 * The `video` field on Product stores the public R2 URL.
 */
export async function addProductVideo(id, file) {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  // Delete existing video from R2 if present
  if (product.video) {
    deleteFile(product.video).catch(() => {});
  }

  const { url } = await processVideoUpload(file.buffer, file.mimetype, UPLOAD_SUBDIRS.PRODUCTS);
  product.video = url;
  await product.save();
  return product;
}

/**
 * Remove the product video — deletes from R2 and clears the field.
 */
export async function removeProductVideo(id) {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  if (product.video) {
    deleteFile(product.video).catch(() => {});
    product.video = undefined;
    await product.save();
  }

  return product;
}
