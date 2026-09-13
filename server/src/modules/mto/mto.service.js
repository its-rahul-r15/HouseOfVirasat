import MtoRequest from './mto.model.js';
import Product from '../product/product.model.js';
import { ApiError } from '../../lib/ApiError.js';
import { sendNotification } from '../../services/notification.service.js';

export async function createMtoRequest(data) {
  const product = await Product.findById(data.productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const mto = await MtoRequest.create({
    productId: product._id,
    productName: product.title,
    productSku: product.sku,
    customer: data.customer,
    selectedVariant: data.selectedVariant,
    preferences: data.preferences,
    pricingMode: product.priceMode,
  });

  try {
    await sendNotification({
      templateKey: 'MTO_RECEIVED',
      to: mto.customer.email,
      variables: {
        customerName: mto.customer.name,
        referenceNumber: mto.referenceNumber,
        productName: mto.productName,
      },
    });
  } catch {
    // Non-blocking notification
  }

  return mto;
}

export async function getMtoByRef(referenceNumber) {
  const mto = await MtoRequest.findOne({ referenceNumber }).populate('productId', 'title images slug');
  if (!mto) {
    throw ApiError.notFound('MTO request not found');
  }
  return mto;
}

export async function getMtoById(id) {
  const mto = await MtoRequest.findById(id).populate('productId');
  if (!mto) {
    throw ApiError.notFound('MTO request not found');
  }
  return mto;
}

export async function listMtoRequests(query = {}) {
  const { page = 1, limit = 20, status, search } = query;
  const filter = {};

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { referenceNumber: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.email': { $regex: search, $options: 'i' } },
      { 'customer.mobile': { $regex: search, $options: 'i' } },
      { productName: { $regex: search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    MtoRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    MtoRequest.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateMtoStatus(id, updateData, adminUser) {
  const mto = await MtoRequest.findById(id);
  if (!mto) {
    throw ApiError.notFound('MTO request not found');
  }

  const { status, quotedPrice, depositAmount, depositPercent, note } = updateData;

  if (status) mto.status = status;
  if (quotedPrice !== undefined) mto.quotedPrice = quotedPrice;
  if (depositAmount !== undefined) mto.depositAmount = depositAmount;
  if (depositPercent !== undefined) mto.depositPercent = depositPercent;

  if (note && adminUser) {
    mto.adminSpecNotes.push({
      note,
      addedBy: adminUser.name || 'Admin',
      addedAt: new Date(),
    });
  }

  await mto.save();

  if (status && ['PRICE_QUOTED', 'IN_PRODUCTION', 'READY_TO_DISPATCH', 'COMPLETED'].includes(status)) {
    try {
      await sendNotification({
        templateKey: `MTO_${status}`,
        to: mto.customer.email,
        variables: {
          customerName: mto.customer.name,
          referenceNumber: mto.referenceNumber,
          productName: mto.productName,
          status,
          quotedPrice: mto.quotedPrice,
        },
      });
    } catch {
      // Non-blocking notification
    }
  }

  return mto;
}
