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

// BUG FIX: Added checkoutLimiter to prevent brute-forcing razorpayOrderIds to cancel orders.
// This endpoint takes a razorpayOrderId and marks the order FAILED. It has no auth check by design
// (the user may not be logged in), so rate limiting is the primary abuse-prevention mechanism.
// The endpoint only transitions PENDING→FAILED (never PAID→FAILED), so a confirmed order is safe.
router.post('/payment-failed', checkoutLimiter, orderController.markPaymentFailed);

// BUG FIX: This public status endpoint intentionally returns ONLY non-PII fields
// (paymentStatus, fulfilmentStatus, trackingLink) — NOT items, total, or customer details.
// See getOrder (admin route) for full order data. Ensure orderController.getOrderStatus only
// returns the safe subset — see order.controller.js.
router.get('/:ref/status', orderController.getOrderStatus);

// Authenticated patron routes
router.get('/my-orders', authenticate, orderController.getMyOrders);

// Admin routes
router.use(authenticate);
router.get('/', requirePermission('view_orders'), validate(listOrdersSchema), orderController.listOrders);
router.get('/:ref', requirePermission('view_orders'), orderController.getOrder);
router.patch('/:id', requirePermission('edit_orders'), validate(updateOrderSchema), orderController.updateOrder);

export default router;

