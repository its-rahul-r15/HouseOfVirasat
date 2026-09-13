import fs from 'fs/promises';
import path from 'path';
import Product from '../modules/product/product.model.js';
import Category from '../modules/category/category.model.js';
import Collection from '../modules/category/collection.model.js';
import logger from '../lib/logger.js';

const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const BASE_URL = process.env.SITE_URL || 'https://houseofvirasat.com';

export async function generateSitemap() {
  try {
    const [products, categories, collections] = await Promise.all([
      Product.find({ availabilityStatus: { $ne: 'ARCHIVED' } }).select('urlHandle updatedAt'),
      Category.find({ isActive: true }).select('slug updatedAt'),
      Collection.find({ isActive: true }).select('slug updatedAt'),
    ]);

    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: '1.0' },
      { loc: '/shop', changefreq: 'daily', priority: '0.9' },
      { loc: '/bespoke', changefreq: 'monthly', priority: '0.7' },
      { loc: '/about', changefreq: 'monthly', priority: '0.6' },
      { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
    ];

    const productUrls = products.map((p) => ({
      loc: `/shop/${p.urlHandle}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: p.updatedAt?.toISOString().split('T')[0],
    }));

    const categoryUrls = categories.map((c) => ({
      loc: `/shop?category=${c.slug}`,
      changefreq: 'daily',
      priority: '0.8',
    }));

    const collectionUrls = collections.map((c) => ({
      loc: `/collections/${c.slug}`,
      changefreq: 'weekly',
      priority: '0.75',
    }));

    const allUrls = [...staticPages, ...categoryUrls, ...collectionUrls, ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    await fs.mkdir(path.dirname(SITEMAP_PATH), { recursive: true });
    await fs.writeFile(SITEMAP_PATH, xml, 'utf-8');
    logger.info(`Sitemap generated: ${allUrls.length} URLs`);
  } catch (err) {
    logger.error(`Sitemap generation failed: ${err.message}`);
  }
}
