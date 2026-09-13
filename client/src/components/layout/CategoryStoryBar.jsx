import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/product.api';

export default function CategoryStoryBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productApi.getCategories()
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  const storyItems = categories.length > 0
    ? [
        { id: 'all', label: 'All Heirlooms', link: '/shop', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=160&q=80', isSpecial: true },
        ...categories.map((c) => ({
          id: c.slug,
          label: c.name.split('&')[0].trim(),
          link: `/shop?category=${c.slug}`,
          image: c.image?.url || 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=160&q=80',
        })),
        { id: 'bespoke', label: 'Bespoke Atelier', link: '/bespoke', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=160&q=80', isBespoke: true },
      ]
    : [
        { id: 'express', label: 'In Stock', link: '/shop?stock=IN_STOCK', image: 'https://images.unsplash.com/photo-1611591475820-22c60c5a2c2b?auto=format&fit=crop&w=160&q=80', isSpecial: true },
        { id: 'polki', label: 'Uncut Polki', link: '/shop?collection=RAJSI', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=160&q=80' },
        { id: 'new', label: 'New Arrivals', link: '/shop?sort=newest', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=160&q=80' },
        { id: 'bridal', label: 'Wedding Suite', link: '/shop?collection=REET', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=160&q=80' },
        { id: 'gold', label: '18K Fine Gold', link: '/shop?metal=GOLD', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=160&q=80' },
        { id: 'silver', label: '925 Silver', link: '/shop?metal=SILVER', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=160&q=80' },
        { id: 'bespoke', label: 'Bespoke Atelier', link: '/bespoke', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=160&q=80', isBespoke: true },
      ];

  return (
    <div className="md:hidden bg-white border-b border-[#E5E2DA] py-2 overflow-x-auto no-scrollbar select-none w-full max-w-full">
      <div className="px-2.5 sm:px-6 flex items-center gap-2.5 sm:gap-4 min-w-max">
        {storyItems.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="flex flex-col items-center gap-1 group w-[60px] sm:w-[70px] shrink-0 text-center"
          >
            {/* Circular Ring with Thumbnail */}
            <div
              className={`w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] rounded-full p-[1.5px] transition-all duration-300 group-hover:scale-105 ${
                item.isBespoke
                  ? 'bg-gradient-to-tr from-[#B89768] via-[#D97706] to-[#5C1A2E] shadow-xs'
                  : item.isSpecial
                  ? 'bg-gradient-to-tr from-[#5C1A2E] to-[#B89768]'
                  : 'bg-[#E5E2DA] group-hover:bg-[#B89768]'
              }`}
            >
              <div className="w-full h-full rounded-full bg-[#F9F8F5] overflow-hidden p-[1px] border border-white">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover object-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Label */}
            <span className="text-[9px] sm:text-[10.5px] font-medium text-[#1A1A1A] leading-tight tracking-tight line-clamp-1 group-hover:text-[#5C1A2E] transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
