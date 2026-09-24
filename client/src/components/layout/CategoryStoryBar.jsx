import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryStoryBar() {
  const storyItems = [
    { id: 'rings', label: 'Rings', link: '/shop?category=rings', image: '/catagories/img3.jpeg' },
    { id: 'earrings', label: 'Earrings', link: '/shop?category=earrings', image: '/catagories/img5.jpeg' },
    { id: 'bangles', label: 'Bangles', link: '/shop?category=bangles', image: '/catagories/img4.jpeg' },
    { id: 'necklaces', label: 'Necklaces', link: '/shop?category=necklaces', image: '/catagories/img2.jpeg' },
  ];

  return (
    <div className="md:hidden bg-white border-b border-[#E5E2DA] py-3 overflow-x-auto no-scrollbar select-none w-full max-w-full">
      <div className="px-4 flex items-center justify-around gap-2 w-full">
        {storyItems.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="flex flex-col items-center gap-1.5 group flex-1 max-w-[80px] shrink-0 text-center"
          >
            {/* Circular Ring Container */}
            <div className="w-[62px] h-[62px] xs:w-[68px] xs:h-[68px] rounded-full p-[2px] bg-gradient-to-tr from-[#C9A84C] via-[#E8D4A2] to-[#B8935A] shadow-xs flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden leading-none flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover object-center block scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Label */}
            <span className="text-[11px] font-medium text-[#2B2320] leading-tight tracking-tight line-clamp-1 group-hover:text-[#5C1A2E] transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
