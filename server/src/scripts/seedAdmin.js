import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import AdminUser from '../modules/auth/adminUser.model.js';
import Collection from '../modules/category/collection.model.js';
import Category from '../modules/category/category.model.js';
import Product from '../modules/product/product.model.js';
import AppSettings from '../modules/settings/appSettings.model.js';
import { ADMIN_ROLE } from '../config/constants.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/house-of-virasat';

async function seed() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Seed Super Admin
    const adminEmail = 'admin@houseofvirasat.com';
    const adminPassword = 'Admin@123';

    let admin = await AdminUser.findOne({ email: adminEmail });
    if (!admin) {
      admin = await AdminUser.create({
        name: 'Master Admin',
        email: adminEmail,
        password: adminPassword,
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
      console.log('👑 Super Admin Created Successfully:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('👑 Super Admin already exists:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   (Password unchanged or: ${adminPassword})`);
    }

    // 2. Seed Collections if empty
    const collectionsData = [
      {
        name: 'REET — Bridal Heritage',
        slug: 'reet',
        description: 'Authentic Jadau & uncut Polki suites set with 24K gold foil.',
        displayOrder: 1,
        isActive: true,
      },
      {
        name: 'RAJSI — Royal Rajputana',
        slug: 'rajsi',
        description: 'Heirloom uncut emeralds & Johari craftsmanship.',
        displayOrder: 2,
        isActive: true,
      },
      {
        name: 'NITYA — Everyday Fine Gold',
        slug: 'nitya',
        description: 'Minimalist 18K/22K hallmarked fine gold jewellery.',
        displayOrder: 3,
        isActive: true,
      },
      {
        name: 'NOOR — Solitaire & Polki',
        slug: 'noor',
        description: 'Statement solitaires and delicate polki constellations.',
        displayOrder: 4,
        isActive: true,
      },
    ];

    for (const c of collectionsData) {
      await Collection.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
    }
    console.log('💎 Collections Seeded (REET, RAJSI, NITYA, NOOR)');

    // 3. Seed Categories if empty
    const categoriesData = [
      { name: 'Necklaces & Chokers', slug: 'necklaces', displayOrder: 1, isActive: true },
      { name: 'Earrings & Chandbalis', slug: 'earrings', displayOrder: 2, isActive: true },
      { name: 'Rings & Solitaires', slug: 'rings', displayOrder: 3, isActive: true },
      { name: 'Bangles & Kadas', slug: 'bangles', displayOrder: 4, isActive: true },
      { name: 'Bridal Suites', slug: 'bridal', displayOrder: 5, isActive: true },
      { name: 'Maang Tikka & Passa', slug: 'maang-tikka', displayOrder: 6, isActive: true },
    ];

    for (const cat of categoriesData) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }
    console.log('✨ Categories Seeded');

    // 4. Seed Products
    const reetCol = await Collection.findOne({ slug: 'reet' });
    const rajsiCol = await Collection.findOne({ slug: 'rajsi' });
    const nityaCol = await Collection.findOne({ slug: 'nitya' });
    const noorCol = await Collection.findOne({ slug: 'noor' });

    const necklaceCat = await Category.findOne({ slug: 'necklaces' });
    const earringCat = await Category.findOne({ slug: 'earrings' });
    const ringCat = await Category.findOne({ slug: 'rings' });
    const bangleCat = await Category.findOne({ slug: 'bangles' });
    const bridalCat = await Category.findOne({ slug: 'bridal' });

    const initialProducts = [
      {
        sku: 'HOV-SLV-0192',
        name: 'Padmavati Jadau Uncut Polki Choker',
        urlHandle: 'padmavati-jadau-uncut-polki-choker',
        category: necklaceCat?._id,
        collection: [reetCol?._id].filter(Boolean),
        metalType: 'SILVER',
        purity: '925',
        priceMode: 'FIXED',
        sellingPrice: 42500,
        compareAtPrice: 48000,
        stockQuantity: 5,
        availabilityStatus: 'IN_STOCK',
        netWeight: 46.2,
        grossWeight: 52.4,
        shortDescription: 'Hand-set uncut syndicate Polki nestled in 925 sterling silver with 24K gold foil setting and royal Jaipur meenakari on the reverse.',
        fullDescription: 'Inspired by the royal courts of Mewar, this choker exemplifies traditional Jadau craftsmanship. Each uncut stone is individually set using pure silver bezels with gold leaf backing to reflect ambient candlelight.',
        heroImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85' },
          { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85' },
        ],
        stones: [{ type: 'POLKI', weight: 12.5, count: 48, clarity: 'Handpicked Syndicate' }],
        tags: ['choker', 'polki', 'jadau', 'bridal', 'silver'],
      },
      {
        sku: 'HOV-SLV-0245',
        name: 'Meenakari Peacock Chandbali Earrings',
        urlHandle: 'meenakari-peacock-chandbali-earrings',
        category: earringCat?._id,
        collection: [rajsiCol?._id].filter(Boolean),
        metalType: 'SILVER',
        purity: '925',
        priceMode: 'FIXED',
        sellingPrice: 18900,
        compareAtPrice: 21500,
        stockQuantity: 8,
        availabilityStatus: 'IN_STOCK',
        netWeight: 22.8,
        grossWeight: 26.5,
        shortDescription: 'Heritage Jaipur hand-enameled peacock chandbalis with uncut Kundan and freshwater seed pearl clusters.',
        fullDescription: 'Exquisite multi-tiered chandbalis featuring fine gulabi meenakari (pink enamel) perfected by Jaipur artisans. Embellished with natural seed pearls.',
        heroImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85' },
        ],
        stones: [{ type: 'KUNDAN', weight: 6.2, count: 24, clarity: 'Traditional' }],
        tags: ['chandbali', 'earrings', 'meenakari', 'kundan'],
      },
      {
        sku: 'HOV-GLD-0511',
        name: 'Nitya 18K Solitaire Gold Band',
        urlHandle: 'nitya-18k-solitaire-gold-band',
        category: ringCat?._id,
        collection: [nityaCol?._id].filter(Boolean),
        metalType: 'GOLD',
        purity: '18K',
        priceMode: 'FIXED',
        sellingPrice: 34500,
        compareAtPrice: 38000,
        stockQuantity: 4,
        availabilityStatus: 'IN_STOCK',
        netWeight: 5.4,
        grossWeight: 5.6,
        shortDescription: 'Solid 18K hallmarked yellow gold minimalist eternity band with brilliant solitaire diamond accent.',
        fullDescription: 'Crafted for modern everyday royalty. Hallmarked 18K solid gold hand-polished to mirror luster with conflict-free VVS solitaire diamond.',
        heroImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85' },
        ],
        stones: [{ type: 'DIAMOND', weight: 0.35, count: 1, clarity: 'VVS-EF' }],
        tags: ['ring', 'gold', 'solitaire', 'diamond', 'everyday'],
      },
      {
        sku: 'HOV-SLV-0388',
        name: 'Roop Royal Filigree Kada with Emeralds',
        urlHandle: 'roop-royal-filigree-kada-emeralds',
        category: bangleCat?._id,
        collection: [noorCol?._id].filter(Boolean),
        metalType: 'SILVER',
        purity: '925',
        priceMode: 'FIXED',
        sellingPrice: 28000,
        compareAtPrice: 31000,
        stockQuantity: 3,
        availabilityStatus: 'IN_STOCK',
        netWeight: 38.0,
        grossWeight: 42.1,
        shortDescription: 'Solid 925 sterling silver kada featuring centuries-old open filigree openwork and Zambian emerald cabochons.',
        fullDescription: 'Hand-carved screw-hinge antique bangle featuring wire-drawn royal filigree patterns set with unheated emerald cabochons.',
        heroImage: 'https://images.unsplash.com/photo-1611591475820-22c60c5a2c2b?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1611591475820-22c60c5a2c2b?auto=format&fit=crop&w=1000&q=85' },
        ],
        stones: [{ type: 'EMERALD', weight: 4.8, count: 8 }],
        tags: ['kada', 'bangles', 'emerald', 'silver'],
      },
      {
        sku: 'HOV-GLD-0820',
        name: 'Maharani Emerald & Pearl Hasli Choker',
        urlHandle: 'maharani-emerald-pearl-hasli-choker',
        category: bridalCat?._id || necklaceCat?._id,
        collection: [reetCol?._id].filter(Boolean),
        metalType: 'GOLD',
        purity: '18K',
        priceMode: 'FIXED',
        sellingPrice: 85000,
        compareAtPrice: 95000,
        stockQuantity: 2,
        availabilityStatus: 'IN_STOCK',
        netWeight: 52.0,
        grossWeight: 60.5,
        shortDescription: 'Imperial rigid gold hasli with Russian emerald droplets and natural Basra pearl fringe.',
        fullDescription: 'A statement neckpiece inspired by the imperial treasuries of Rajasthan. Handcrafted in 18K solid gold with bezel-set emeralds.',
        heroImage: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85' },
        ],
        stones: [{ type: 'EMERALD', weight: 8.5, count: 12 }, { type: 'PEARL', weight: 5.0, count: 20 }],
        tags: ['hasli', 'choker', 'bridal', 'gold', 'emerald'],
      },
      {
        sku: 'HOV-SLV-0612',
        name: 'Virasat Navratan Jadau Cocktail Ring',
        urlHandle: 'virasat-navratan-jadau-cocktail-ring',
        category: ringCat?._id,
        collection: [rajsiCol?._id].filter(Boolean),
        metalType: 'SILVER',
        purity: '925',
        priceMode: 'FIXED',
        sellingPrice: 14500,
        compareAtPrice: 16500,
        stockQuantity: 6,
        availabilityStatus: 'IN_STOCK',
        netWeight: 16.4,
        grossWeight: 18.2,
        shortDescription: 'Auspicious nine-gemstone astrological cocktail ring in 925 silver with gold-leaf jadau setting.',
        fullDescription: 'Featuring ruby, pearl, coral, emerald, yellow sapphire, diamond, blue sapphire, hessonite, and cat’s eye arranged in sacred geometric harmony.',
        heroImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85' },
        ],
        stones: [{ type: 'GEMSTONE', weight: 4.5, count: 9 }],
        tags: ['ring', 'navratan', 'cocktail', 'silver'],
      }
    ];

    for (const p of initialProducts) {
      await Product.findOneAndUpdate({ sku: p.sku }, p, { upsert: true, new: true });
    }
    console.log('💎 Catalog Products Seeded into Database');

    // 5. Seed Settings if empty
    if (AppSettings) {
      const defaultSettings = {
        whatsappNumber: '+919876543210',
        freeShippingThreshold: 5000,
        gstRate: 3,
        invoicePrefix: 'HOV-INV',
      };
      await AppSettings.findOneAndUpdate({ _singleton: 'settings' }, defaultSettings, { upsert: true, new: true });
      console.log('⚙️ App Settings Initialized');
    }

    console.log('\n========================================');
    console.log('🎉 ADMIN & STORE SEEDING COMPLETE!');
    console.log('========================================');
    console.log('Admin Login Credentials:');
    console.log('  URL: /login or API: POST /api/v1/auth/login');
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seed();
