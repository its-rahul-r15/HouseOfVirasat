import * as contentService from './content.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

// Content Blocks
export const listBlocks = catchAsync(async (req, res) => {
  const blocks = await contentService.listContentBlocks(req.query.type, req.query.admin === 'true');
  ApiResponse.ok(res, blocks);
});

export const getBlock = catchAsync(async (req, res) => {
  const block = await contentService.getContentBlockByKey(req.params.key);
  ApiResponse.ok(res, block);
});

export const createBlock = catchAsync(async (req, res) => {
  const block = await contentService.createContentBlock(req.body);
  ApiResponse.created(res, block, 'Content block created');
});

export const updateBlock = catchAsync(async (req, res) => {
  const block = await contentService.updateContentBlock(req.params.id, req.body);
  ApiResponse.ok(res, block, 'Content block updated');
});

export const deleteBlock = catchAsync(async (req, res) => {
  await contentService.deleteContentBlock(req.params.id);
  ApiResponse.ok(res, null, 'Content block deleted');
});

// Notification Templates
export const listTemplates = catchAsync(async (req, res) => {
  const templates = await contentService.listNotificationTemplates();
  ApiResponse.ok(res, templates);
});

export const getTemplate = catchAsync(async (req, res) => {
  const template = await contentService.getNotificationTemplateByKey(req.params.key);
  ApiResponse.ok(res, template);
});

export const createTemplate = catchAsync(async (req, res) => {
  const template = await contentService.createNotificationTemplate(req.body);
  ApiResponse.created(res, template, 'Template created');
});

export const updateTemplate = catchAsync(async (req, res) => {
  const template = await contentService.updateNotificationTemplate(req.params.id, req.body);
  ApiResponse.ok(res, template, 'Template updated');
});

export const deleteTemplate = catchAsync(async (req, res) => {
  await contentService.deleteNotificationTemplate(req.params.id);
  ApiResponse.ok(res, null, 'Template deleted');
});
