export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tuyo-mio-ytlo.vercel.app/api';

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    VERIFY_TOKEN: '/auth/verify',
    
    // Items endpoints
    ITEMS: '/items',
    ITEM_BY_ID: (id) => `/items/${id}`,
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};

export const LOCAL_STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data',
};
