import express from 'express';
import { handleRazorpayWebhook, handleShiprocketWebhook } from './webhook.controller.js';

const router = express.Router();

router.post('/razorpay', handleRazorpayWebhook);
router.post('/shiprocket', handleShiprocketWebhook);

export default router;
