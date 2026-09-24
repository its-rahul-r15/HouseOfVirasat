import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import logger from '../lib/logger.js';

// ─── R2 S3-compatible client ───────────────────────────────────────────────
// R2 uses AWS S3 API — endpoint is https://<accountId>.r2.cloudflarestorage.com
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a buffer to Cloudflare R2.
 *
 * @param {Buffer} buffer       - Processed image buffer (e.g. WebP from Sharp)
 * @param {string} key          - R2 object key e.g. "products/2026/09/abc.webp"
 * @param {string} contentType  - MIME type, defaults to "image/webp"
 * @returns {Promise<string>}   - Public CDN URL of the uploaded object
 */
export async function uploadToR2(buffer, key, contentType = 'image/webp') {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Content-addressed filenames (nanoid + timestamp) never change → safe to cache forever
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  const url = `${env.R2_PUBLIC_URL}/${key}`;
  logger.info(`R2: uploaded ${key}`);
  return url;
}

/**
 * Delete an object from Cloudflare R2.
 * Accepts either:
 *   - Full public URL: https://pub-xxx.r2.dev/products/2026/09/abc.webp
 *   - R2 object key:  products/2026/09/abc.webp
 *
 * Fails silently — orphaned R2 objects are cheap; hard errors on delete are not worth crashing for.
 *
 * @param {string} keyOrUrl - R2 object key or full public URL
 */
export async function deleteFromR2(keyOrUrl) {
  try {
    let key = keyOrUrl;

    if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
      const url = new URL(keyOrUrl);
      // Strip leading slash → R2 key has no leading slash
      key = url.pathname.replace(/^\//, '');
    }

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      }),
    );

    logger.info(`R2: deleted ${key}`);
  } catch (err) {
    logger.warn(`R2: could not delete "${keyOrUrl}" — ${err.message}`);
  }
}
