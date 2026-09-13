import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(env.UPLOADS_DIR, 'temp'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${nanoid()}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_IMAGE_MIMES.includes(file.mimetype)) {
    return cb(ApiError.badRequest('Only JPEG, PNG, WebP, or AVIF images are allowed'));
  }
  cb(null, true);
};

export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});

export const uploadBespokeImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});
