import axios from 'axios';
import { env } from '../config/env.js';
import logger from '../lib/logger.js';

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken = null;
let tokenExpiry = null;

async function getAuthToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email: env.SHIPROCKET_EMAIL,
    password: env.SHIPROCKET_PASSWORD,
  });

  cachedToken = response.data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // Shiprocket tokens last 10 days

  return cachedToken;
}

async function shiprocketRequest(method, endpoint, data = null) {
  const token = await getAuthToken();
  const response = await axios({
    method,
    url: `${BASE_URL}${endpoint}`,
    data,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function checkServiceability({ pickupPincode, deliveryPincode, weight, cod }) {
  return shiprocketRequest('get', `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod ? 1 : 0}`);
}

export async function createShipment(orderData) {
  return shiprocketRequest('post', '/orders/create/adhoc', orderData);
}

export async function generateAWB({ shipmentId, courierId }) {
  return shiprocketRequest('post', '/courier/assign/awb', {
    shipment_id: shipmentId,
    courier_id: courierId,
  });
}

export async function getTrackingDetails(shipmentId) {
  return shiprocketRequest('get', `/courier/track/shipment/${shipmentId}`);
}

export async function cancelShipment(awbCode) {
  return shiprocketRequest('post', '/orders/cancel/shipment/awbs', { awbs: [awbCode] });
}

export function buildShiprocketOrder(order, settings) {
  const item = order.items[0];
  return {
    order_id: order.referenceNumber,
    order_date: new Date(order.createdAt).toISOString().split('T')[0],
    pickup_location: 'Primary',
    channel_id: '',
    comment: order.notes || '',
    billing_customer_name: order.customer.name,
    billing_last_name: '',
    billing_address: order.shippingAddress.line1,
    billing_address_2: order.shippingAddress.line2 || '',
    billing_city: order.shippingAddress.city,
    billing_pincode: order.shippingAddress.pincode,
    billing_state: order.shippingAddress.state,
    billing_country: order.shippingAddress.country,
    billing_email: order.customer.email,
    billing_phone: order.customer.mobile,
    shipping_is_billing: true,
    order_items: order.items.map((i) => ({
      name: i.name,
      sku: i.sku,
      units: i.qty,
      selling_price: i.priceAtPurchase,
      discount: 0,
      tax: settings.gstRate || 3,
    })),
    payment_method: order.paymentStatus === 'PAID' ? 'Prepaid' : 'COD',
    sub_total: order.total,
    length: 10,
    breadth: 10,
    height: 5,
    weight: 0.5,
  };
}
