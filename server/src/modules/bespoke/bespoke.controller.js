import * as bespokeService from './bespoke.service.js';
import { ApiResponse } from '../../lib/ApiResponse.js';
import catchAsync from '../../lib/catchAsync.js';

export const createBespoke = catchAsync(async (req, res) => {
  const bodyData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const result = await bespokeService.createBespokeEnquiry(bodyData, req.files || []);
  ApiResponse.created(res, result, 'Bespoke inquiry received successfully');
});

export const getBespokeStatus = catchAsync(async (req, res) => {
  const enquiry = await bespokeService.getBespokeByRef(req.params.ref);
  ApiResponse.ok(res, {
    referenceNumber: enquiry.referenceNumber,
    jewelleryType: enquiry.jewelleryType,
    status: enquiry.status,
    createdAt: enquiry.createdAt,
  });
});

export const listBespoke = catchAsync(async (req, res) => {
  const result = await bespokeService.listBespokeEnquiries(req.query);
  ApiResponse.ok(res, result.items, 'OK', result.pagination);
});

export const getBespoke = catchAsync(async (req, res) => {
  const enquiry = await bespokeService.getBespokeById(req.params.id);
  ApiResponse.ok(res, enquiry);
});

export const updateBespoke = catchAsync(async (req, res) => {
  const enquiry = await bespokeService.updateBespokeStatus(req.params.id, req.body, req.user);
  ApiResponse.ok(res, enquiry, 'Bespoke inquiry updated');
});

export const getMyBespoke = catchAsync(async (req, res) => {
  const enquiries = await bespokeService.getMyBespoke(req.user?.email);
  ApiResponse.ok(res, enquiries);
});

