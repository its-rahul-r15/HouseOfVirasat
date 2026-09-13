import express from 'express';
import * as mtoController from './mto.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { enquiryLimiter } from '../../middlewares/rateLimit.middleware.js';
import { createMtoSchema, updateMtoStatusSchema, listMtoSchema } from './mto.schema.js';

const router = express.Router();

// Public routes
router.post('/', enquiryLimiter, validate(createMtoSchema), mtoController.createMto);
router.get('/:ref/status', mtoController.getMtoStatus);

// Admin routes
router.use(authenticate);
router.get('/', requirePermission('view_orders'), validate(listMtoSchema), mtoController.listMto);
router.get('/:id', requirePermission('view_orders'), mtoController.getMto);
router.patch('/:id', requirePermission('edit_orders'), validate(updateMtoStatusSchema), mtoController.updateMto);

export default router;
