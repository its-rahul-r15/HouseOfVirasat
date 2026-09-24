import sharp from 'sharp';
import path from 'path';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import logger from '../lib/logger.js';
import { uploadToR2, deleteFromR2 } from './r2.service.js';

// ─── Subdirectory constants ────────────────────────────────────────────────
export const UPLOAD_SUBDIRS = {
  PRODUCTS: 'products',
  BESPOKE: 'bespoke',
  CATEGORIES: 'categories',
  COLLECTIONS: 'collections',
  CONTENT: 'content',
  SETTINGS: 'settings',
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Returns a date-sharded key prefix: `subDir/YYYY/MM`
 * Mirrors MongoDB's natural time-based document growth — each month's uploads
 * live in their own "folder" in R2, keeping object listings manageable.
 *
 * Example: getDateSubpath('products') → "products/2026/09"
 */
function getDateSubpath(subDir) {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${subDir}/${year}/${month}`;
}

// ─── Core upload functions ─────────────────────────────────────────────────

/**
 * Processes an in-memory file upload (multer memoryStorage):
 *  1. Resizes & converts to WebP (1200×1200 max, quality 85) via Sharp
 *  2. Uploads the resulting buffer directly to Cloudflare R2
 *  3. Returns { path, url } — `path` is the R2 key stored in MongoDB,
 *     `url` is the public CDN URL served to clients
 *
 * @param {Buffer} fileBuffer - Raw file buffer from multer memoryStorage (file.buffer)
 * @param {string} subDir     - One of UPLOAD_SUBDIRS values
 */
export async function processUpload(fileBuffer, subDir = UPLOAD_SUBDIRS.PRODUCTS) {
  const dateSubpath = getDateSubpath(subDir);
  const filename = `${nanoid()}-${Date.now()}.webp`;
  const r2Key = `${dateSubpath}/${filename}`;

  const webpBuffer = await sharp(fileBuffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const url = await uploadToR2(webpBuffer, r2Key, 'image/webp');

  return { path: r2Key, url };
}

/**
 * Uploads a product video buffer directly to R2 (no transcoding).
 * Videos are stored as-is — MP4/WebM/MOV preserved with original MIME type.
 *
 * @param {Buffer} fileBuffer  - Raw video buffer from multer memoryStorage (file.buffer)
 * @param {string} mimeType    - Original MIME type e.g. "video/mp4"
 * @param {string} subDir      - One of UPLOAD_SUBDIRS values (default: PRODUCTS)
 * @returns {Promise<{path, url}>}
 */
export async function processVideoUpload(fileBuffer, mimeType, subDir = UPLOAD_SUBDIRS.PRODUCTS) {
  const extMap = {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  };
  const ext = extMap[mimeType] || 'mp4';
  const dateSubpath = getDateSubpath(subDir);
  const filename = `vid-${nanoid()}-${Date.now()}.${ext}`;
  const r2Key = `${dateSubpath}/${filename}`;

  const url = await uploadToR2(fileBuffer, r2Key, mimeType);
  return { path: r2Key, url };
}


/**
 * Processes a thumbnail upload:
 *  1. Crops to 400×400 cover
 *  2. Uploads to R2 with `thumb-` prefix
 *  3. Returns { path, url }
 *
 * @param {Buffer} fileBuffer - Raw file buffer from multer memoryStorage (file.buffer)
 * @param {string} subDir     - One of UPLOAD_SUBDIRS values
 */
export async function processThumbnail(fileBuffer, subDir = UPLOAD_SUBDIRS.PRODUCTS) {
  const dateSubpath = getDateSubpath(subDir);
  const filename = `thumb-${nanoid()}-${Date.now()}.webp`;
  const r2Key = `${dateSubpath}/${filename}`;

  const webpBuffer = await sharp(fileBuffer)
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  const url = await uploadToR2(webpBuffer, r2Key, 'image/webp');

  return { path: r2Key, url };
}

/**
 * Deletes a stored file from Cloudflare R2.
 * Accepts either:
 *   - R2 object key:   products/2026/09/abc.webp
 *   - Full CDN URL:    https://pub-xxx.r2.dev/products/2026/09/abc.webp
 *
 * Delegates to r2.service.js which handles URL → key extraction.
 */
export async function deleteFile(fileRef) {
  await deleteFromR2(fileRef);
}

/**
 * No-op — temp dir cleanup not needed with memoryStorage.
 * Kept for backwards compatibility with any callers (e.g. cleanup jobs).
 */
export async function cleanTempDir() {
  logger.info('cleanTempDir: no-op (using R2 memoryStorage — no temp files on disk)');
}

/**
 * No-op — upload dirs not needed with R2.
 * Kept for backwards compatibility with server boot sequence.
 */
export async function initUploadDirs() {
  logger.info('initUploadDirs: skipped — using Cloudflare R2 for storage');
  return Object.values(UPLOAD_SUBDIRS);
}
