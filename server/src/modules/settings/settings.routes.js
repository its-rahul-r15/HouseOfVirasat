import express from 'express';
import * as settingsController from './settings.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  updateSettingsSchema,
  shippingRuleSchema,
  updateShippingRuleSchema,
} from './settings.schema.js';

const router = express.Router();

// Public settings
router.get('/public', settingsController.getPublicSettings);
router.get('/shipping-rules/active', settingsController.listShippingRules);

// Admin settings
router.use(authenticate);

router.get('/', requirePermission('view_settings'), settingsController.getSettings);
router.patch('/', requirePermission('edit_settings'), validate(updateSettingsSchema), settingsController.updateSettings);

// Shipping Rules CRUD
router.get('/shipping-rules', requirePermission('view_settings'), settingsController.listShippingRules);
router.post('/shipping-rules', requirePermission('edit_settings'), validate(shippingRuleSchema), settingsController.createShippingRule);
router.patch('/shipping-rules/:id', requirePermission('edit_settings'), validate(updateShippingRuleSchema), settingsController.updateShippingRule);
router.delete('/shipping-rules/:id', requirePermission('edit_settings'), settingsController.deleteShippingRule);

export default router;
