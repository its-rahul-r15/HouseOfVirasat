import express from 'express';
import * as productController from './product.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { publicApiLimiter, uploadLimiter } from '../../middlewares/rateLimit.middleware.js';
import { uploadProductImages, uploadProductVideo } from '../../middlewares/upload.middleware.js';
import { createProductSchema, updateProductSchema, listProductsSchema } from './product.schema.js';

const router = express.Router();

// Public routes
router.get('/', publicApiLimiter, validate(listProductsSchema), productController.listProducts);
router.get('/:handle', publicApiLimiter, productController.getProduct);

// Admin routes
router.use(authenticate);

router.post(
  '/upload',
  requirePermission('manageProducts'),
  uploadLimiter,
  uploadProductImages.any(),
  productController.uploadStandaloneImages,
);

router.get('/admin/:id', requirePermission('manageProducts'), productController.adminGetProduct);

router.post(
  '/',
  requirePermission('manageProducts'),
  validate(createProductSchema),
  productController.createProduct,
);

router.put(
  '/:id',
  requirePermission('manageProducts'),
  validate(updateProductSchema),
  productController.updateProduct,
);

router.patch('/:id/archive', requirePermission('manageProducts'), productController.archiveProduct);
router.post('/:id/duplicate', requirePermission('manageProducts'), productController.duplicateProduct);
router.patch('/:id/stock', requirePermission('manageProducts'), productController.updateStock);

router.post(
  '/:id/images',
  requirePermission('manageProducts'),
  uploadLimiter,
  uploadProductImages.array('images', 10),
  productController.uploadImages,
);

router.delete('/:id/images', requirePermission('manageProducts'), productController.removeImage);

// Video upload/remove routes
router.post(
  '/:id/video',
  requirePermission('manageProducts'),
  uploadLimiter,
  uploadProductVideo.single('video'),
  productController.uploadVideo,
);

router.delete('/:id/video', requirePermission('manageProducts'), productController.removeVideo);

export default router;
