import * as mtoService from './mto.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

export const createMto = catchAsync(async (req, res) => {
  const result = await mtoService.createMtoRequest(req.body);
  ApiResponse.created(res, result, 'Make-to-order inquiry received successfully');
});

export const getMtoStatus = catchAsync(async (req, res) => {
  const mto = await mtoService.getMtoByRef(req.params.ref);
  ApiResponse.ok(res, {
    referenceNumber: mto.referenceNumber,
    productName: mto.productName,
    status: mto.status,
    quotedPrice: mto.quotedPrice,
    depositAmount: mto.depositAmount,
    createdAt: mto.createdAt,
  });
});

export const listMto = catchAsync(async (req, res) => {
  const result = await mtoService.listMtoRequests(req.query);
  ApiResponse.ok(res, result.items, 'OK', result.pagination);
});

export const getMto = catchAsync(async (req, res) => {
  const mto = await mtoService.getMtoById(req.params.id);
  ApiResponse.ok(res, mto);
});

export const updateMto = catchAsync(async (req, res) => {
  const mto = await mtoService.updateMtoStatus(req.params.id, req.body, req.user);
  ApiResponse.ok(res, mto, 'MTO request updated');
});
