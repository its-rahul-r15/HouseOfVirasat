import ContentBlock from './contentBlock.model.js';
import NotificationTemplate from './notificationTemplate.model.js';
import { ApiError } from '../../lib/ApiError.js';

// Content Blocks
export async function listContentBlocks(type, admin = false) {
  const filter = admin ? {} : { isActive: true };
  if (type) filter.type = type.toUpperCase();
  return ContentBlock.find(filter).sort({ displayOrder: 1, createdAt: -1 });
}

export async function getContentBlockByKey(key) {
  const block = await ContentBlock.findOne({ key, isActive: true });
  if (!block) {
    throw ApiError.notFound(`Content block '${key}' not found`);
  }
  return block;
}

export async function createContentBlock(data) {
  const existing = await ContentBlock.findOne({ key: data.key });
  if (existing) {
    throw ApiError.conflict(`Content block with key '${data.key}' already exists`);
  }
  return ContentBlock.create(data);
}

export async function updateContentBlock(id, data) {
  const block = await ContentBlock.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!block) {
    throw ApiError.notFound('Content block not found');
  }
  return block;
}

export async function deleteContentBlock(id) {
  const block = await ContentBlock.findByIdAndDelete(id);
  if (!block) {
    throw ApiError.notFound('Content block not found');
  }
  return { id };
}

// Notification Templates
export async function listNotificationTemplates() {
  return NotificationTemplate.find().sort({ key: 1 });
}

export async function getNotificationTemplateByKey(key) {
  const template = await NotificationTemplate.findOne({ key });
  if (!template) {
    throw ApiError.notFound(`Notification template '${key}' not found`);
  }
  return template;
}

export async function createNotificationTemplate(data) {
  const existing = await NotificationTemplate.findOne({ key: data.key });
  if (existing) {
    throw ApiError.conflict(`Notification template '${data.key}' already exists`);
  }
  return NotificationTemplate.create(data);
}

export async function updateNotificationTemplate(id, data) {
  const template = await NotificationTemplate.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!template) {
    throw ApiError.notFound('Notification template not found');
  }
  return template;
}

export async function deleteNotificationTemplate(id) {
  const template = await NotificationTemplate.findByIdAndDelete(id);
  if (!template) {
    throw ApiError.notFound('Notification template not found');
  }
  return { id };
}
