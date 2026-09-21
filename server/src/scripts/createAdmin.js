/**
 * createAdmin.js
 * ──────────────────────────────────────────────
 * Standalone script to create a Super Admin user.
 * Usage:
 *   node src/scripts/createAdmin.js
 *   node src/scripts/createAdmin.js --email=you@example.com --password=MyPass@123 --name="Your Name"
 * ──────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import AdminUser from '../modules/auth/adminUser.model.js';
import { ADMIN_ROLE } from '../config/constants.js';

// ─── Parse CLI args (--key=value) ───────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, ...v] = a.replace('--', '').split('=');
      return [k, v.join('=')];
    })
);

// ─── Admin credentials (override via CLI args) ───────────────────────────────
const ADMIN_NAME     = args.name     || 'Super Admin';
const ADMIN_EMAIL    = args.email    || 'admin@houseofvirasat.com';
const ADMIN_PASSWORD = args.password || 'Admin@123';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/house-of-virasat';

async function createAdmin() {
  console.log('\n========================================');
  console.log('🔧  House of Virasat — Admin Creator');
  console.log('========================================\n');

  try {
    console.log(`📡 Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existing = await AdminUser.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log('⚠️  Admin with this email already exists!');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Role:  ${existing.role}`);
      console.log('\n💡 Tip: Use --email= flag to create with a different email.');
      console.log('   Example: node src/scripts/createAdmin.js --email=new@admin.com --password=NewPass@123\n');
    } else {
      const admin = await AdminUser.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: ADMIN_ROLE.SUPER_ADMIN,
        permissions: {
          manageProducts: true,
          manageOrders: true,
          manageMto: true,
          manageBespoke: true,
          manageContent: true,
          manageCoupons: true,
          manageSettings: true,
          viewReports: true,
          viewCustomers: true,
          manageUsers: true,
        },
        isActive: true,
      });

      console.log('👑 Super Admin Created Successfully!');
      console.log('────────────────────────────────────');
      console.log(`   Name:     ${admin.name}`);
      console.log(`   Email:    ${admin.email}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`   Role:     ${admin.role}`);
      console.log('────────────────────────────────────');
      console.log('🔐 IMPORTANT: Change your password after first login!');
    }

    console.log('\n========================================');
    console.log('✅ Done!');
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error creating admin:', err.message);
    if (err.code === 11000) {
      console.error('   → Duplicate key: Admin with this email already exists.');
    }
    process.exit(1);
  }
}

createAdmin();
