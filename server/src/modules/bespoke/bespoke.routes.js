import express from 'express';
import * as bespokeController from './bespoke.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { uploadBespokeImages } from '../../middlewares/upload.middleware.js';
import { enquiryLimiter } from '../../middlewares/rateLimit.middleware.js';
import { createBespokeSchema, updateBespokeSchema, listBespokeSchema } from './bespoke.schema.js';

const router = express.Router();

// Public routes
router.post(
  '/',
  enquiryLimiter,
  uploadBespokeImages.array('images', 5),
  (req, res, next) => {
    // If multipart form data, parse JSON payload from req.body.data if needed
    if (typeof req.body.data === 'string') {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        // Leave as is for zod validation to handle
      }
    }
    next();
  },
  validate(createBespokeSchema),
  bespokeController.createBespoke
);

router.get('/:ref/status', bespokeController.getBespokeStatus);

// Authenticated patron routes
router.get('/my-enquiries', authenticate, bespokeController.getMyBespoke);

// Admin routes
router.use(authenticate);
router.get('/', requirePermission('view_orders'), validate(listBespokeSchema), bespokeController.listBespoke);
router.get('/:id', requirePermission('view_orders'), bespokeController.getBespoke);
router.patch('/:id', requirePermission('edit_orders'), validate(updateBespokeSchema), bespokeController.updateBespoke);

export default router;

