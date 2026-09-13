import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from current directory, parent directory, and server folder
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().default('mongodb://localhost:27017/house-of-virasat'),

  JWT_SECRET: z.string().min(16).default('default_secret_key_house_of_virasat_jwt_secure'),
  JWT_REFRESH_SECRET: z.string().min(16).default('default_refresh_secret_key_house_of_virasat_jwt_secure'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('*'),

  RAZORPAY_KEY_ID: z.string().default('rzp_test_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().default('placeholder_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('placeholder_webhook_secret'),

  SHIPROCKET_EMAIL: z.string().default('shipping@houseofvirasat.com'),
  SHIPROCKET_PASSWORD: z.string().default('placeholder_password'),

  EMAIL_PROVIDER: z.enum(['resend', 'brevo', 'ses']).default('resend'),
  RESEND_API_KEY: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  AWS_SES_REGION: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@houseofvirasat.com'),

  UPLOADS_DIR: z.string().default('./uploads'),
  CDN_BASE_URL: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:\n');
  parsed.error.issues.forEach((issue) => {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
