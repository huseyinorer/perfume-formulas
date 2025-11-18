// API Endpoints
export const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    CHANGE_PASSWORD: '/api/change-password',

    // Perfumes
    PERFUMES: '/api/perfumes',
    PERFUME_BY_ID: (id: number | string) => `/api/perfumes/${id}`,
    PERFUME_DETAILS: (id: number | string) => `/api/perfumes/${id}/details`,
    PERFUME_SEARCH: '/api/perfumes/search',

    // Formulas
    FORMULAS: '/api/formulas',
    PERFUME_FORMULAS: (id: number | string) => `/api/perfumes/${id}/formulas`,
    FORMULA_REQUEST: '/api/formulas/request',
    PENDING_FORMULAS: '/api/formulas/pending',
    APPROVE_FORMULA: (id: number | string) => `/api/formulas/approve/${id}`,
    REJECT_FORMULA: (id: number | string) => `/api/formulas/reject/${id}`,
    DELETE_FORMULA: (id: number | string) => `/api/formulas/${id}`,

    // Favorites
    FAVORITES: '/api/favorites',
    TOGGLE_FAVORITE: '/api/favorites/toggle',

    // Ratings
    FORMULA_RATINGS: (formulaId: number | string) => `/api/formulas/${formulaId}/ratings`,
    USER_RATING: (formulaId: number | string) => `/api/formulas/${formulaId}/user-rating`,
    UPDATE_RATING: (ratingId: number | string) => `/api/formulas/ratings/${ratingId}`,
    DELETE_RATING: (ratingId: number | string) => `/api/formulas/ratings/${ratingId}`,

    // Brands
    BRANDS: '/api/brands',

    // Stock
    STOCK: '/api/perfume-stock',
    STOCK_BY_ID: (id: number | string) => `/api/perfume-stock/${id}`,
    MATURATION: '/api/perfume-stock/maturation',
    MATURATION_BY_PERFUME: (id: number | string) => `/api/perfume-stock/maturation/by-perfume/${id}`,
    COMPLETE_MATURATION: (id: number | string) => `/api/perfume-stock/maturation/${id}/complete`,
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_SORT_BY: 'brand',
    DEFAULT_SORT_ORDER: 'asc',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    THEME: 'theme',
} as const;
