import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import logger from '../lib/logger.js';

const clean = (val) => (typeof val === 'string' ? val.trim().replace(/^["']|["']$/g, '') : val);

const accountId = clean(env.R2_ACCOUNT_ID);
const accessKeyId = clean(env.R2_ACCESS_KEY_ID);
const secretAccessKey = clean(env.R2_SECRET_ACCESS_KEY);
const bucketName = clean(env.R2_BUCKET_NAME);
const publicUrl = clean(env.R2_PUBLIC_URL);

if (accountId && accessKeyId && secretAccessKey && bucketName) {
  const maskedKey = accessKeyId.length > 8 ? `${accessKeyId.slice(0, 4)}...${accessKeyId.slice(-4)}` : '****';
  const maskedSecret = secretAccessKey.length > 8 ? `${secretAccessKey.slice(0, 4)}...${secretAccessKey.slice(-4)}` : '****';
  logger.info(`📦 R2 Storage initialized: bucket="${bucketName}", endpoint="https://${accountId}.r2.cloudflarestorage.com", keyId="${maskedKey}", secret="${maskedSecret}" (len: ${secretAccessKey.length})`);
} else {
  logger.warn('⚠️ R2 Storage: Missing one or more R2 credentials in environment variables.');
}

function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
    credentials:
      accessKeyId && secretAccessKey
        ? {
            accessKeyId,
            secretAccessKey,
          }
        : undefined,
  });
}

const r2Client = getR2Client();

/**
 * Upload a buffer to Cloudflare R2.
 *
 * @param {Buffer} buffer       - Processed image buffer (e.g. WebP from Sharp)
 * @param {string} key          - R2 object key e.g. "products/2026/09/abc.webp"
 * @param {string} contentType  - MIME type, defaults to "image/webp"
 * @returns {Promise<string>}   - Public CDN URL of the uploaded object
 */
export async function uploadToR2(buffer, key, contentType = 'image/webp') {
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    logger.error(`R2: Missing credentials — accountId=${!!accountId}, accessKey=${!!accessKeyId}, secretKey=${!!secretAccessKey}, bucket=${!!bucketName}`);
    throw new Error('Cloudflare R2 storage is not configured on this server. Please check your environment variables.');
  }

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Content-addressed filenames (nanoid + timestamp) never change → safe to cache forever
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    const publicBase = (publicUrl || '').replace(/\/$/, '');
    const url = `${publicBase}/${key}`;
    logger.info(`R2: successfully uploaded ${key} -> ${url}`);
    return url;
  } catch (err) {
    logger.error(`R2 upload failed for key "${key}": ${err.message} (bucket: ${bucketName}, keyId: ${accessKeyId ? accessKeyId.slice(0, 4) + '...' : 'none'})`);
    throw err;
  }
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
        Bucket: bucketName,
        Key: key,
      }),
    );

    logger.info(`R2: deleted ${key}`);
  } catch (err) {
    logger.warn(`R2: could not delete "${keyOrUrl}" — ${err.message}`);
  }
}
