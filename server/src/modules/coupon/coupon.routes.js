import express from 'express';
import * as couponController from './coupon.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { validateCouponSchema, createCouponSchema, updateCouponSchema, listCouponsSchema } from './coupon.schema.js';

const router = express.Router();

// Public validation
router.post('/validate', validate(validateCouponSchema), couponController.validateCoupon);

// Admin routes
router.use(authenticate);
router.get('/', requirePermission('view_settings'), validate(listCouponsSchema), couponController.listCoupons);
router.post('/', requirePermission('edit_settings'), validate(createCouponSchema), couponController.createCoupon);
router.get('/:id', requirePermission('view_settings'), couponController.getCoupon);
router.patch('/:id', requirePermission('edit_settings'), validate(updateCouponSchema), couponController.updateCoupon);
router.delete('/:id', requirePermission('edit_settings'), couponController.deleteCoupon);

export default router;
