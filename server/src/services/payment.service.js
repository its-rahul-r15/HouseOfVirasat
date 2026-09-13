import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export async function createPaymentOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay works in paise
    currency,
    receipt,
    notes,
  });
  return order;
}

export function verifyWebhookSignature(rawBody, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw ApiError.unauthorized('Invalid webhook signature');
  }
}

export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export async function initiateRefund({ paymentId, amount, notes = {} }) {
  return razorpay.payments.refund(paymentId, {
    amount: Math.round(amount * 100),
    notes,
  });
}

export async function fetchPayment(paymentId) {
  return razorpay.payments.fetch(paymentId);
}
