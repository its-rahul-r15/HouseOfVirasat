import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi } from '../api/settings.api';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    storeName: 'House of Virasat',
    whatsappNumber: '919876543210',
    goldRate24k: 7300,
    goldRate18k: 5500,
    silverRate925: 88,
    announcementText: '100% Certified 925 Silver & BIS Hallmarked Gold · Insured Pan-India Shipping',
    freeShippingThreshold: 5000,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    settingsApi.getPublicSettings()
      .then((res) => {
        if (mounted && res?.data) {
          setSettings((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      })
      .catch((err) => {
        console.warn('Using default store settings:', err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const axiosClient = (await import('../api/axiosClient')).default;
      const res = await axiosClient.patch('/settings', newSettings);
      const data = res?.data || res;
      setSettings((prev) => ({
        ...prev,
        ...data,
      }));
      return data;
    } catch (err) {
      console.warn('Local settings update fallback:', err);
      setSettings((prev) => ({
        ...prev,
        ...newSettings,
      }));
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
