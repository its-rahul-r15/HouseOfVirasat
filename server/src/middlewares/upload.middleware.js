import multer from 'multer';
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
 * All uploads are held in RAM via memoryStorage.
 * multer populates file.buffer (the raw bytes) instead of file.path.
 * image.service.js processUpload() receives file.buffer, runs Sharp in-memory,
 * and uploads the resulting WebP buffer directly to Cloudflare R2.
 *
 * No temp files are written to VPS disk — zero local storage footprint.
 */
const memStorage = multer.memoryStorage();

// ─── Named multer instances per upload context ─────────────────────────────

/** Product gallery images — up to 10 files, 10MB each */
export const uploadProductImages = multer({
  storage: memStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});

/** Bespoke enquiry reference images — up to 5 files, 5MB each */
export const uploadBespokeImages = multer({
  storage: memStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

/** Category / collection banner images — single file, 5MB */
export const uploadCategoryImage = multer({
  storage: memStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

/** Content block images (banners, hero sections, etc.) — single file, 8MB */
export const uploadContentImage = multer({
  storage: memStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});

/** Settings / branding images (logo, favicon, OG image) — single file, 2MB */
export const uploadSettingsImage = multer({
  storage: memStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});
