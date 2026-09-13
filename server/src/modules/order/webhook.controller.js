import { verifyWebhookSignature } from '../../services/payment.service.js';
import * as orderService from './order.service.js';
import Order from './order.model.js';
import { PAYMENT_STATUS, FULFILMENT_STATUS } from '../../config/constants.js';
import logger from '../../lib/logger.js';
import { ApiResponse } from '../../lib/ApiResponse.js';

export async function handleRazorpayWebhook(req, res) {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  if (signature) {
    try {
      verifyWebhookSignature(rawBody, signature);
    } catch (err) {
      logger.error('Razorpay signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }
  }

  const { event, payload } = req.body;

  try {
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payment?.entity;
      const razorpayOrderId = payment?.order_id || payload.order?.entity?.id;
      const paymentId = payment?.id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus !== PAYMENT_STATUS.PAID) {
          await orderService.confirmOrder(order._id, razorpayOrderId, paymentId, 'ONLINE');
          logger.info(`Payment confirmed via webhook for Order: ${order.referenceNumber}`);
        }
      }
    } else if (event === 'payment.failed') {
      const payment = payload.payment?.entity;
      if (payment?.order_id) {
        await Order.findOneAndUpdate(
          { razorpayOrderId: payment.order_id, paymentStatus: PAYMENT_STATUS.PENDING },
          { paymentStatus: PAYMENT_STATUS.FAILED }
        );
      }
    }
  } catch (err) {
    logger.error('Error processing Razorpay webhook:', err);
  }

  return res.status(200).json({ status: 'ok' });
}

export async function handleShiprocketWebhook(req, res) {
  const { current_status, awb, order_id, courier_name, tracking_url } = req.body;

  try {
    if (order_id) {
      const updateData = {};
      if (awb) updateData.awbCode = awb;
      if (courier_name) updateData.courierPartner = courier_name;
      if (tracking_url) updateData.trackingLink = tracking_url;

      if (current_status === 'DELIVERED') {
        updateData.fulfilmentStatus = FULFILMENT_STATUS.DELIVERED;
      } else if (current_status === 'IN TRANSIT' || current_status === 'OUT FOR DELIVERY') {
        updateData.fulfilmentStatus = FULFILMENT_STATUS.DISPATCHED;
      } else if (current_status === 'RTO INITIATED' || current_status === 'RTO DELIVERED') {
        updateData.fulfilmentStatus = FULFILMENT_STATUS.RTO;
      }

      await Order.findOneAndUpdate({ referenceNumber: order_id }, updateData);
      logger.info(`Updated tracking for order ${order_id}: status ${current_status}`);
    }
  } catch (err) {
    logger.error('Error processing Shiprocket webhook:', err);
  }

  return res.status(200).json({ status: 'ok' });
}
