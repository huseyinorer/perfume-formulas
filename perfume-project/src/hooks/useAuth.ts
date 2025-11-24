import { useState, useEffect, useCallback } from 'react';
import { User, LoginResponse } from '../types/api.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  }, []);

  const loadUserFromToken = useCallback(() => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      // JWT token decode etme
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        console.error("Invalid token format");
        handleLogout();
        return;
      }

      // Base64 decode işlemi
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      // Token expire kontrolü
      const expirationTime = payload.exp * 1000;

      if (Date.now() >= expirationTime) {
        console.log("Token expired, logging out");
        handleLogout();
        return;
      }

      // Token geçerli, kullanıcıyı set et
      setUser(payload);
      setIsLoggedIn(true);
      setIsAdmin(!!payload.isAdmin);

      // Token süresi dolmadan önce otomatik logout için timer
      const timeUntilExpiry = expirationTime - Date.now();
      const maxTimeout = Math.min(timeUntilExpiry, 60 * 60 * 1000); // 1 saat veya token süresinin dolmasına kalan süre

      const timer = setTimeout(() => {
        loadUserFromToken();
      }, maxTimeout);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error parsing token:", error);
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const handleLogin = async (response: LoginResponse) => {
    const { token, user } = response;
    localStorage.setItem("token", token);
    setUser(user);
    setIsLoggedIn(true);
    setIsAdmin(!!user.isAdmin);
  };

  return {
    user,
    isLoggedIn,
    isAdmin,
    handleLogin,
    handleLogout,
    loadUserFromToken
  };
};
