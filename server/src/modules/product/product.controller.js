import * as productService from './product.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

export const listProducts = catchAsync(async (req, res) => {
  const result = await productService.listProducts(req.query);
  ApiResponse.ok(res, result.products, 'OK', result.pagination);
});

export const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductByHandle(req.params.handle);
  ApiResponse.ok(res, product);
});

export const adminGetProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  ApiResponse.ok(res, product);
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);
  ApiResponse.created(res, product, 'Product created');
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  ApiResponse.ok(res, product, 'Product updated');
});

export const archiveProduct = catchAsync(async (req, res) => {
  const product = await productService.archiveProduct(req.params.id, req.body.redirectTo);
  ApiResponse.ok(res, product, 'Product archived');
});

export const duplicateProduct = catchAsync(async (req, res) => {
  const product = await productService.duplicateProduct(req.params.id, req.user._id);
  ApiResponse.created(res, product, 'Product duplicated');
});

export const uploadImages = catchAsync(async (req, res) => {
  const product = await productService.addProductImages(req.params.id, req.files);
  ApiResponse.ok(res, product, 'Images uploaded');
});

export const uploadStandaloneImages = catchAsync(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) {
    return ApiResponse.badRequest(res, 'No files uploaded');
  }
  const processed = await productService.processStandaloneUploads(files);
  const urls = processed.map((p) => p.url);
  ApiResponse.ok(res, { urls, files: processed, url: urls[0] }, 'Images uploaded successfully');
});

export const removeImage = catchAsync(async (req, res) => {
  const product = await productService.removeProductImage(req.params.id, req.body.imageUrl);
  ApiResponse.ok(res, product, 'Image removed');
});

export const updateStock = catchAsync(async (req, res) => {
  const product = await productService.updateStockQuantity(req.params.id, req.body.quantity);
  ApiResponse.ok(res, product, 'Stock updated');
});
