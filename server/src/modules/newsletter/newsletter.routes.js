import express from 'express';
import * as newsletterController from './newsletter.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';

const router = express.Router();

// Public — anyone can subscribe
router.post('/subscribe', newsletterController.subscribe);

// Admin only
router.get('/', authenticate, requirePermission('view_settings'), newsletterController.getSubscribers);
router.delete('/:id', authenticate, requirePermission('edit_settings'), newsletterController.unsubscribe);

export default router;
