import { useState, useCallback } from 'react';
import { authApi } from '@/services';
import { STORAGE_KEYS } from '@/utils/constants';
import type { User, LoginRequest, RegisterRequest } from '@/types/api.types';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.login(credentials);
            localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
            setUser(response.user);
            setIsLoggedIn(true);
            setIsAdmin(response.user.isAdmin);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.register(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Registration failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
    }, []);

    const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
        if (!user) throw new Error('User not logged in');

        setLoading(true);
        setError(null);
        try {
            const response = await authApi.changePassword(user.id, oldPassword, newPassword);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Password change failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const loadUserFromToken = useCallback(() => {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) return;

            // Decode JWT token
            const base64Url = token.split('.')[1];
            if (!base64Url) {
                logout();
                return;
            }

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const payload = JSON.parse(jsonPayload);

            // Check token expiration
            const expirationTime = payload.exp * 1000;
            if (Date.now() >= expirationTime) {
                logout();
                return;
            }

            // Set user from token
            setUser(payload);
            setIsLoggedIn(true);
            setIsAdmin(!!payload.isAdmin);
        } catch (err) {
            console.error('Error parsing token:', err);
            logout();
        }
    }, [logout]);

    return {
        user,
        isLoggedIn,
        isAdmin,
        loading,
        error,
        login,
        register,
        logout,
        changePassword,
        loadUserFromToken,
    };
};
