import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();



export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('hov_auth_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hov_user_profile');
    if (saved && localStorage.getItem('hov_auth_token')) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // strictly null when not logged in
  });
  const [loading, setLoading] = useState(!!localStorage.getItem('hov_auth_token'));

  // Sync token to axios headers and hydrate profile on mount
  useEffect(() => {
    if (token) {
      localStorage.setItem('hov_auth_token', token);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axiosClient
        .get('/auth/me')
        .then((res) => {
          const fetchedUser = res.data?.user || res.data?.data?.user || res.data?.data || res.data;
          if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem('hov_user_profile', JSON.stringify(fetchedUser));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      delete axiosClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('hov_auth_token');
      localStorage.removeItem('hov_user_profile');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Real API Login — totpCode optional for 2FA second step
  const login = async (email, password, totpCode) => {
    const body = { email, password };
    if (totpCode) body.totpCode = totpCode;

    const res = await axiosClient.post('/auth/login', body);
    const payload = res.data?.data || res.data;

    // Server signals 2FA is needed — no token yet
    if (payload?.requires2FA) {
      throw new Error('requires2FA');
    }

    const newToken = payload.accessToken;
    const userData = payload.user;

    localStorage.setItem('hov_auth_token', newToken);
    localStorage.setItem('hov_user_profile', JSON.stringify(userData));
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    setToken(newToken);
    setUser(userData);
    return userData;
  };

  // Real API Register
  const register = async (formData) => {
    const res = await axiosClient.post('/auth/register', formData);
    const payload = res.data?.data || res.data;
    const newToken = payload.accessToken;
    const userData = payload.user;

    localStorage.setItem('hov_auth_token', newToken);
    localStorage.setItem('hov_user_profile', JSON.stringify(userData));
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    setToken(newToken);
    setUser(userData);
    return userData;
  };



  // Clean Logout
  const logout = () => {
    if (token && !token.startsWith('demo_')) {
      axiosClient.post('/auth/logout').catch(() => {});
    }
    delete axiosClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('hov_auth_token');
    localStorage.removeItem('hov_user_profile');
    setToken(null);
    setUser(null);
  };

  // Profile Updates
  const updateProfile = async (updatedFields) => {
    if (token && !token.startsWith('demo_')) {
      const res = await axiosClient.put('/auth/profile', updatedFields);
      const updated = res.data?.data?.user || res.data?.user || res.data;
      setUser(updated);
      localStorage.setItem('hov_user_profile', JSON.stringify(updated));
      return updated;
    } else {
      const updated = { ...user, ...updatedFields };
      setUser(updated);
      localStorage.setItem('hov_user_profile', JSON.stringify(updated));
      return updated;
    }
  };

  // Addresses Helpers
  const addAddress = (newAddress) => {
    const addresses = user?.addresses ? [...user.addresses] : [];
    const id = 'addr_' + Date.now();
    const formatted = { ...newAddress, id, isDefault: addresses.length === 0 || newAddress.isDefault };
    let updatedList = addresses;
    if (formatted.isDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }
    updateProfile({ addresses: [...updatedList, formatted] });
  };

  const updateAddress = (id, updatedData) => {
    const addresses = (user?.addresses || []).map((addr) => {
      if (addr.id === id || addr._id === id) {
        return { ...addr, ...updatedData };
      }
      if (updatedData.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });
    updateProfile({ addresses });
  };

  const deleteAddress = (id) => {
    const filtered = (user?.addresses || []).filter((a) => a.id !== id && a._id !== id);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    updateProfile({ addresses: filtered });
  };

  const setDefaultAddress = (id) => {
    const addresses = (user?.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === id || a._id === id,
    }));
    updateProfile({ addresses });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
        updateUser: updateProfile,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
