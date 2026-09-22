import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';

// ─── Allowed MIME types ────────────────────────────────────────────────────
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// ─── File filter ───────────────────────────────────────────────────────────
const imageFileFilter = (req, file, cb) => {
  if (!ALLOWED_IMAGE_MIMES.includes(file.mimetype)) {
    return cb(ApiError.badRequest('Only JPEG, PNG, WebP, or AVIF images are allowed'));
  }
  cb(null, true);
};

/**
 * All uploads land in `uploads/temp/` first.
 * The image.service.js `processUpload()` then converts & moves them to the
 * organized date-sharded path: uploads/{subDir}/{YYYY}/{MM}/{file}.webp
 *
 * This keeps multer simple and stateless — it doesn't need to know the
 * target subdir; that's determined by the service layer.
 */
import fs from 'fs';

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(env.UPLOADS_DIR, 'temp');
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // nanoid + timestamp = collision-proof unique filenames
    cb(null, `${nanoid()}-${Date.now()}${ext}`);
  },
});

// ─── Named multer instances per upload context ─────────────────────────────

/** Product gallery images — up to 10 files, 10MB each */
export const uploadProductImages = multer({
  storage: tempStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});

/** Bespoke enquiry reference images — up to 5 files, 5MB each */
export const uploadBespokeImages = multer({
  storage: tempStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

/** Category / collection banner images — single file, 5MB */
export const uploadCategoryImage = multer({
  storage: tempStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

/** Content block images (banners, hero sections, etc.) — single file, 8MB */
export const uploadContentImage = multer({
  storage: tempStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});

/** Settings / branding images (logo, favicon, OG image) — single file, 2MB */
export const uploadSettingsImage = multer({
  storage: tempStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});
