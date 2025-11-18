// API Types
export interface User {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface Perfume {
    id: number;
    brand_id?: number;
    brand: string;
    name: string;
    type?: string;
    pyramid_note?: string;
    top_notes?: string;
    middle_notes?: string;
    base_notes?: string;
    olfactive_family?: string;
    recommended_usage?: string;
    formulaCount?: number;
    is_favorite?: boolean;
}

export interface Formula {
    id: number;
    perfume_id: number;
    fragrancePercentage: number;
    alcoholPercentage: number;
    waterPercentage: number;
    restDay: number;
    created_at?: string;
    averageRating?: number;
    reviewCount?: number;
}

export interface FormulaRequest {
    perfume_id: number;
    fragrancePercentage: number;
    alcoholPercentage: number;
    waterPercentage: number;
    restDay: number;
    userId?: number | null;
}

export interface PendingRequest extends Formula {
    brand?: string;
    perfumeName?: string;
    status?: string;
}

export interface Rating {
    id: number;
    formula_id: number;
    user_id: number;
    username?: string;
    rating: number;
    comment?: string;
    created_at: string;
    updated_at?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    limit?: number;
}

export interface Brand {
    brand_id: number;
    brand_name: string;
}

export interface Stock {
    id: number;
    perfume_id: number;
    name: string;
    top_notes?: string;
    middle_notes?: string;
    base_notes?: string;
    price: number;
    stock_quantity: number;
    category?: string;
    maturing_quantity?: number;
    maturing_info?: string;
}

export interface Maturation {
    id: number;
    perfume_id: number;
    perfume_name?: string;
    maturation_start_date: string;
    quantity: number;
    notes?: string;
    created_at?: string;
    days_maturing?: number;
}
