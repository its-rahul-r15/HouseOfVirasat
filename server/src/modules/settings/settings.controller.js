import * as settingsService from './settings.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

// App Settings
export const getPublicSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.getPublicSettings();
  ApiResponse.ok(res, settings);
});

export const getSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.getAllSettings();
  ApiResponse.ok(res, settings);
});

export const updateSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  ApiResponse.ok(res, settings, 'Settings updated');
});

// Shipping Rules
export const listShippingRules = catchAsync(async (req, res) => {
  const rules = await settingsService.listShippingRules(req.query.admin === 'true');
  ApiResponse.ok(res, rules);
});

export const createShippingRule = catchAsync(async (req, res) => {
  const rule = await settingsService.createShippingRule(req.body);
  ApiResponse.created(res, rule, 'Shipping rule created');
});

export const updateShippingRule = catchAsync(async (req, res) => {
  const rule = await settingsService.updateShippingRule(req.params.id, req.body);
  ApiResponse.ok(res, rule, 'Shipping rule updated');
});

export const deleteShippingRule = catchAsync(async (req, res) => {
  await settingsService.deleteShippingRule(req.params.id);
  ApiResponse.ok(res, null, 'Shipping rule deleted');
});
