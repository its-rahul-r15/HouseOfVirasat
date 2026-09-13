import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function AnnouncementBar() {
  const { settings } = useSettings();

  return (
    <div className="bg-[#8A1826] text-white text-[11.5px] sm:text-[12px] font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 font-sans shadow-xs">
      <span>{settings.announcementText || 'Unlock Joy with Certified 925 Silver & BIS Hallmarked Gold · Insured Pan-India Shipping · Shop Now'}</span>
    </div>
  );
}
