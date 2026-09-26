import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/product.api';

const DEFAULT_STORY_ITEMS = [
  { id: 'rings', name: 'Rings', slug: 'rings', image: { url: '/catagories/img3.jpeg' } },
  { id: 'earrings', name: 'Earrings', slug: 'earrings', image: { url: '/catagories/img5.jpeg' } },
  { id: 'bangles', name: 'Bangles', slug: 'bangles', image: { url: '/catagories/img4.jpeg' } },
  { id: 'necklaces', name: 'Necklaces', slug: 'necklaces', image: { url: '/catagories/img2.jpeg' } },
];

const FALLBACK_IMAGES = [
  '/catagories/img3.jpeg',
  '/catagories/img5.jpeg',
  '/catagories/img4.jpeg',
  '/catagories/img2.jpeg',
  '/catagories/img1.jpeg',
];

export default function CategoryStoryBar({ categories: propCategories }) {
  const [categories, setCategories] = useState(propCategories || []);
  const [loading, setLoading] = useState(!propCategories || propCategories.length === 0);

  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
      setLoading(false);
    } else {
      productApi.getCategories()
        .then((res) => {
          const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : (res?.categories || []);
          if (list && list.length > 0) {
            setCategories(list);
          } else {
            setCategories(DEFAULT_STORY_ITEMS);
          }
        })
        .catch(() => {
          setCategories(DEFAULT_STORY_ITEMS);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [propCategories]);

  const displayList = categories.length > 0 ? categories : DEFAULT_STORY_ITEMS;

  return (
    <div className="md:hidden bg-white border-b border-[#E5E2DA] py-3 overflow-x-auto no-scrollbar select-none w-full max-w-full">
      <div className="px-4 flex items-center justify-around gap-2 w-full">
        {displayList.map((item, idx) => {
          const imageUrl = item.image?.url || (typeof item.image === 'string' ? item.image : '') || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
          const label = item.name || item.label || 'Jewellery';
          const slug = item.slug || item.id || '';
          const link = `/shop?category=${slug}`;

          return (
            <Link
              key={item._id || item.id || slug || idx}
              to={link}
              className="flex flex-col items-center gap-1.5 group flex-1 max-w-[80px] shrink-0 text-center"
            >
              {/* Circular Ring Container — outer is gradient border, inner is the actual circle */}
              <div className="w-[62px] h-[62px] xs:w-[68px] xs:h-[68px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#C9A84C] via-[#E8D4A2] to-[#B8935A] shadow-xs shrink-0">
                {/* Inner circle — must be block with explicit full size, no padding */}
                <div className="w-full h-full rounded-full overflow-hidden block bg-[#FAF6F0]">
                  <img
                    src={imageUrl}
                    alt={label}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                    }}
                    className="w-full h-full object-cover object-center block"
                    loading="lazy"
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Label */}
              <span className="text-[11px] font-medium text-[#2B2320] leading-tight tracking-tight line-clamp-1 group-hover:text-[#5C1A2E] transition-colors">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

