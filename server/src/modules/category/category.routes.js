import express from 'express';
import * as categoryController from './category.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { uploadCategoryImage } from '../../middlewares/upload.middleware.js';
import {
  categorySchema,
  updateCategorySchema,
  collectionSchema,
  updateCollectionSchema,
} from './category.schema.js';

const router = express.Router();

// ─── Categories — Public ───────────────────────────────────────────────────
router.get('/categories', categoryController.listCategories);
router.get('/categories/:slug', categoryController.getCategory);

// ─── Categories — Admin ────────────────────────────────────────────────────
router.post('/categories', authenticate, requirePermission('edit_products'), validate(categorySchema), categoryController.createCategory);
router.patch('/categories/:id', authenticate, requirePermission('edit_products'), validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/categories/:id', authenticate, requirePermission('edit_products'), categoryController.deleteCategory);

// Category image upload: POST /api/v1/categories/:id/image  (field name: "image")
router.post(
  '/categories/:id/image',
  authenticate,
  requirePermission('edit_products'),
  uploadCategoryImage.single('image'),
  categoryController.uploadCategoryImageHandler,
);

// ─── Collections — Public ──────────────────────────────────────────────────
router.get('/collections', categoryController.listCollections);
router.get('/collections/:slug', categoryController.getCollection);

// ─── Collections — Admin ───────────────────────────────────────────────────
router.post('/collections', authenticate, requirePermission('edit_products'), validate(collectionSchema), categoryController.createCollection);
router.patch('/collections/:id', authenticate, requirePermission('edit_products'), validate(updateCollectionSchema), categoryController.updateCollection);
router.delete('/collections/:id', authenticate, requirePermission('edit_products'), categoryController.deleteCollection);

// Collection image upload: POST /api/v1/collections/:id/image  (field name: "image")
router.post(
  '/collections/:id/image',
  authenticate,
  requirePermission('edit_products'),
  uploadCategoryImage.single('image'),
  categoryController.uploadCollectionImageHandler,
);

export default router;
