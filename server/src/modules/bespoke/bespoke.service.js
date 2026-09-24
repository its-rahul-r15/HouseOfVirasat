import BespokeEnquiry from './bespoke.model.js';
import { ApiError } from '../../lib/ApiError.js';
import { processUpload } from '../../services/image.service.js';
import { sendNotification } from '../../services/notification.service.js';

export async function createBespokeEnquiry(data, files = []) {
  const referenceImages = [];

  for (const file of files) {
    const uploaded = await processUpload(file.buffer, 'bespoke');
    referenceImages.push(uploaded.url);
  }

  const enquiry = await BespokeEnquiry.create({
    ...data,
    referenceImages,
  });

  try {
    await sendNotification({
      templateKey: 'BESPOKE_RECEIVED',
      to: enquiry.contact.email,
      variables: {
        customerName: enquiry.contact.name,
        referenceNumber: enquiry.referenceNumber,
      },
    });
  } catch {
    // Non-blocking notification
  }

  return enquiry;
}

export async function getBespokeByRef(referenceNumber) {
  const enquiry = await BespokeEnquiry.findOne({ referenceNumber });
  if (!enquiry) {
    throw ApiError.notFound('Bespoke enquiry not found');
  }
  return enquiry;
}

export async function getBespokeById(id) {
  const enquiry = await BespokeEnquiry.findById(id);
  if (!enquiry) {
    throw ApiError.notFound('Bespoke enquiry not found');
  }
  return enquiry;
}

export async function listBespokeEnquiries(query = {}) {
  const { page = 1, limit = 20, status, search } = query;
  const filter = {};

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { referenceNumber: { $regex: search, $options: 'i' } },
      { 'contact.name': { $regex: search, $options: 'i' } },
      { 'contact.email': { $regex: search, $options: 'i' } },
      { 'contact.mobile': { $regex: search, $options: 'i' } },
      { jewelleryType: { $regex: search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    BespokeEnquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    BespokeEnquiry.countDocuments(filter),
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

export async function updateBespokeStatus(id, updateData, adminUser) {
  const enquiry = await BespokeEnquiry.findById(id);
  if (!enquiry) {
    throw ApiError.notFound('Bespoke enquiry not found');
  }

  const { status, note } = updateData;
  if (status) enquiry.status = status;

  if (note && adminUser) {
    enquiry.crmHandoffNotes.push({
      note,
      addedBy: adminUser.name || 'Admin',
      addedAt: new Date(),
    });
  }

  await enquiry.save();
  return enquiry;
}

export async function getMyBespoke(email) {
  if (!email) return [];
  return BespokeEnquiry.find({ 'contact.email': email.toLowerCase().trim() }).sort({ createdAt: -1 });
}

