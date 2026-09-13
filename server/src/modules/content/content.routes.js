import express from 'express';
import * as contentController from './content.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  contentBlockSchema,
  updateContentBlockSchema,
  notificationTemplateSchema,
  updateNotificationTemplateSchema,
} from './content.schema.js';

const router = express.Router();

// Content Blocks - Public
router.get('/blocks', contentController.listBlocks);
router.get('/blocks/:key', contentController.getBlock);

// Protected Admin routes
router.use(authenticate);

// Content Blocks - Admin
router.post('/blocks', requirePermission('edit_content'), validate(contentBlockSchema), contentController.createBlock);
router.patch('/blocks/:id', requirePermission('edit_content'), validate(updateContentBlockSchema), contentController.updateBlock);
router.delete('/blocks/:id', requirePermission('edit_content'), contentController.deleteBlock);

// Notification Templates - Admin
router.get('/templates', requirePermission('view_settings'), contentController.listTemplates);
router.get('/templates/:key', requirePermission('view_settings'), contentController.getTemplate);
router.post('/templates', requirePermission('edit_settings'), validate(notificationTemplateSchema), contentController.createTemplate);
router.patch('/templates/:id', requirePermission('edit_settings'), validate(updateNotificationTemplateSchema), contentController.updateTemplate);
router.delete('/templates/:id', requirePermission('edit_settings'), contentController.deleteTemplate);

export default router;
