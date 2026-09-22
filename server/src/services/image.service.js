import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import logger from '../lib/logger.js';

// ─── Subdirectory constants ────────────────────────────────────────────────
export const UPLOAD_SUBDIRS = {
  PRODUCTS: 'products',
  BESPOKE: 'bespoke',
  CATEGORIES: 'categories',
  COLLECTIONS: 'collections',
  CONTENT: 'content',
  SETTINGS: 'settings',
};

const TEMP_DIR = path.join(env.UPLOADS_DIR, 'temp');

// ─── Helpers ───────────────────────────────────────────────────────────────

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Returns a date-sharded subdirectory path: `subDir/YYYY/MM`
 * Mirrors MongoDB's natural time-based document growth — each month's uploads
 * live in their own folder, keeping directory sizes manageable on VPS storage.
 *
 * Example: processUpload(file, 'products') → uploads/products/2026/09/abc.webp
 */
function getDateSubpath(subDir) {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return path.join(subDir, year, month);
}

/**
 * Builds the public URL for a stored file.
 * On VPS: CDN_BASE_URL=https://api.houseofvirasat.com → full absolute URL
 * In dev: CDN_BASE_URL=http://localhost:3000 → local URL
 */
function buildPublicUrl(relativePath) {
  // Normalize Windows backslashes to forward slashes for URL
  const normalized = relativePath.replace(/\\/g, '/');
  if (env.CDN_BASE_URL) {
    return `${env.CDN_BASE_URL}/uploads${normalized}`;
  }
  return `/uploads${normalized}`;
}

// ─── Core upload functions ─────────────────────────────────────────────────

/**
 * Processes a temp file upload:
 *  1. Resizes & converts to WebP (1200×1200 max, quality 85)
 *  2. Saves to organized path: uploads/{subDir}/{YYYY}/{MM}/{nanoid}-{timestamp}.webp
 *  3. Deletes the temp file
 *  4. Returns { path, url } — `path` is the relative path stored in MongoDB,
 *     `url` is the full public URL served to clients
 */
export async function processUpload(tempFilePath, subDir = UPLOAD_SUBDIRS.PRODUCTS) {
  const dateSubpath = getDateSubpath(subDir);
  const outputDir = path.join(env.UPLOADS_DIR, dateSubpath);
  await ensureDir(outputDir);

  const filename = `${nanoid()}-${Date.now()}.webp`;
  const outputPath = path.join(outputDir, filename);

  await sharp(tempFilePath)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath);

  // Remove temp file after processing
  await fs.unlink(tempFilePath).catch(() => {});

  // Relative path stored in MongoDB (forward slashes, no leading slash)
  const relativePath = `/${dateSubpath.replace(/\\/g, '/')}/${filename}`;

  return {
    path: relativePath,
    url: buildPublicUrl(`/${dateSubpath.replace(/\\/g, '/')}/${filename}`),
  };
}

/**
 * Processes a thumbnail upload:
 *  1. Crops to 400×400 cover
 *  2. Saves alongside main images with `thumb-` prefix
 *  3. Returns { path, url }
 */
export async function processThumbnail(tempFilePath, subDir = UPLOAD_SUBDIRS.PRODUCTS) {
  const dateSubpath = getDateSubpath(subDir);
  const outputDir = path.join(env.UPLOADS_DIR, dateSubpath);
  await ensureDir(outputDir);

  const filename = `thumb-${nanoid()}-${Date.now()}.webp`;
  const outputPath = path.join(outputDir, filename);

  await sharp(tempFilePath)
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(outputPath);

  const relativePath = `/${dateSubpath.replace(/\\/g, '/')}/${filename}`;

  return {
    path: relativePath,
    url: buildPublicUrl(`/${dateSubpath.replace(/\\/g, '/')}/${filename}`),
  };
}

/**
 * Deletes a stored file.
 * Accepts either:
 *   - Relative path as stored in MongoDB:  /products/2026/09/abc.webp
 *   - Full CDN/API URL:  https://api.houseofvirasat.com/uploads/products/2026/09/abc.webp
 *
 * Strips the CDN origin and /uploads prefix automatically so callers don't
 * need to worry about which format they have.
 */
export async function deleteFile(fileRef) {
  try {
    let relativePath = fileRef;

    // If it's a full URL, extract only the path after /uploads
    if (fileRef.startsWith('http://') || fileRef.startsWith('https://')) {
      const url = new URL(fileRef);
      relativePath = url.pathname.replace(/^\/uploads/, '');
    } else if (fileRef.startsWith('/uploads')) {
      relativePath = fileRef.replace(/^\/uploads/, '');
    }

    const fullPath = path.join(env.UPLOADS_DIR, relativePath.replace(/^\//, ''));
    await fs.unlink(fullPath);
  } catch (err) {
    logger.warn(`Could not delete file: ${fileRef} — ${err.message}`);
  }
}

/**
 * Cleans stale temp files older than 1 hour.
 * Called by a scheduled job (jobs/cleanup.job.js) — safe to run frequently.
 */
export async function cleanTempDir() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    let cleaned = 0;

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const stat = await fs.stat(filePath);
        if (now - stat.mtimeMs > ONE_HOUR) {
          await fs.unlink(filePath);
          cleaned++;
        }
      } catch {
        // File may have been deleted already — skip
      }
    }

    if (cleaned > 0) {
      logger.info(`Temp cleanup: removed ${cleaned} stale file(s)`);
    }
  } catch {
    // Temp dir may not exist yet — not an error
  }
}

/**
 * Ensures all upload subdirectories exist on startup.
 * Call this during server boot so VPS has the folder structure ready
 * before the first request arrives.
 */
export async function initUploadDirs() {
  const subdirs = Object.values(UPLOAD_SUBDIRS);
  await ensureDir(TEMP_DIR);
  // Top-level subdirs created on demand; we just ensure temp exists at startup
  logger.info(`Upload dirs initialized at: ${path.resolve(env.UPLOADS_DIR)}`);
  return subdirs;
}
