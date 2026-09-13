import express from 'express';
import * as adminController from './admin.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', requirePermission('view_analytics'), adminController.getDashboard);
router.get('/reports/sales', requirePermission('view_analytics'), adminController.getSalesReport);

// Admin staff management (Super Admin / Settings access)
router.get('/users', requirePermission('manage_admins'), adminController.listAdmins);
router.post('/users', requirePermission('manage_admins'), adminController.createAdmin);
router.patch('/users/:id', requirePermission('manage_admins'), adminController.updateAdmin);

export default router;
