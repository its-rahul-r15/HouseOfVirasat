import * as categoryService from './category.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

// Categories
export const listCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.listCategories(req.query.admin === 'true');
  ApiResponse.ok(res, categories);
});

export const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  ApiResponse.ok(res, category);
});

export const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  ApiResponse.created(res, category, 'Category created');
});

export const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  ApiResponse.ok(res, category, 'Category updated');
});

export const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  ApiResponse.ok(res, null, 'Category deleted');
});

// Collections
export const listCollections = catchAsync(async (req, res) => {
  const collections = await categoryService.listCollections(req.query.admin === 'true');
  ApiResponse.ok(res, collections);
});

export const getCollection = catchAsync(async (req, res) => {
  const collection = await categoryService.getCollectionBySlug(req.params.slug);
  ApiResponse.ok(res, collection);
});

export const createCollection = catchAsync(async (req, res) => {
  const collection = await categoryService.createCollection(req.body);
  ApiResponse.created(res, collection, 'Collection created');
});

export const updateCollection = catchAsync(async (req, res) => {
  const collection = await categoryService.updateCollection(req.params.id, req.body);
  ApiResponse.ok(res, collection, 'Collection updated');
});

export const deleteCollection = catchAsync(async (req, res) => {
  await categoryService.deleteCollection(req.params.id);
  ApiResponse.ok(res, null, 'Collection deleted');
});
