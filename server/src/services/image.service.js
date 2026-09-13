import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import logger from '../lib/logger.js';

const PRODUCTS_DIR = path.join(env.UPLOADS_DIR, 'products');
const TEMP_DIR = path.join(env.UPLOADS_DIR, 'temp');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function processUpload(tempFilePath, subDir = 'products') {
  const outputDir = path.join(env.UPLOADS_DIR, subDir);
  await ensureDir(outputDir);

  const filename = `${nanoid()}-${Date.now()}.webp`;
  const outputPath = path.join(outputDir, filename);

  await sharp(tempFilePath)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath);

  await fs.unlink(tempFilePath).catch(() => {});

  const relativePath = `/${subDir}/${filename}`;
  const cdnUrl = env.CDN_BASE_URL ? `${env.CDN_BASE_URL}${relativePath}` : relativePath;

  return { path: relativePath, url: cdnUrl };
}

export async function processThumbnail(tempFilePath, subDir = 'products') {
  const outputDir = path.join(env.UPLOADS_DIR, subDir);
  await ensureDir(outputDir);

  const filename = `thumb-${nanoid()}-${Date.now()}.webp`;
  const outputPath = path.join(outputDir, filename);

  await sharp(tempFilePath)
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(outputPath);

  const relativePath = `/${subDir}/${filename}`;
  const cdnUrl = env.CDN_BASE_URL ? `${env.CDN_BASE_URL}${relativePath}` : relativePath;

  return { path: relativePath, url: cdnUrl };
}

export async function deleteFile(filePath) {
  try {
    const fullPath = path.join(env.UPLOADS_DIR, filePath.replace(/^\//, ''));
    await fs.unlink(fullPath);
  } catch (err) {
    logger.warn(`Could not delete file: ${filePath} — ${err.message}`);
  }
}

export async function cleanTempDir() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stat = await fs.stat(filePath);
      if (now - stat.mtimeMs > 60 * 60 * 1000) {
        await fs.unlink(filePath);
      }
    }
  } catch {
    // Temp dir may not exist yet — not an error
  }
}
