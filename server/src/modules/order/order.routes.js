import express from 'express';
import * as orderController from './order.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { checkoutLimiter } from '../../middlewares/rateLimit.middleware.js';
import { createOrderSchema, updateOrderSchema, listOrdersSchema } from './order.schema.js';

const router = express.Router();

// Public routes
router.post('/checkout', checkoutLimiter, validate(createOrderSchema), orderController.initiateCheckout);

// Payment verification — rate-limited; server HMAC signature check prevents fake confirmations
router.post('/verify-payment', checkoutLimiter, orderController.verifyPayment);

// Let client notify server of user-dismissed / failed payment to release stock hold early
router.post('/payment-failed', orderController.markPaymentFailed);

router.get('/:ref/status', orderController.getOrderStatus);

// Authenticated patron routes
router.get('/my-orders', authenticate, orderController.getMyOrders);

// Admin routes
router.use(authenticate);
router.get('/', requirePermission('view_orders'), validate(listOrdersSchema), orderController.listOrders);
router.get('/:ref', requirePermission('view_orders'), orderController.getOrder);
router.patch('/:id', requirePermission('edit_orders'), validate(updateOrderSchema), orderController.updateOrder);

export default router;

