import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '../const/constants';

// Obtener token del localStorage
const getToken = () => localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

// Crear headers con autenticación
const getAuthHeaders = () => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Manejar respuestas de la API
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ 
            message: 'Error en la solicitud' 
        }));
        throw new Error(error.message || `Error ${response.status}`);
    }
    return await response.json();
};

// Servicios de autenticación
export const authService = {
    async login(emailOrUsername, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailOrUsername, password }),
            });
            return await handleResponse(response);
        } catch (error) {
            throw new Error('No se pudo conectar con el servidor. Por favor, intenta más tarde.');
        }
    },

    async register(username, email, password, phone = '', location = '') {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, phone, location }),
            });
            return await handleResponse(response);
        } catch (error) {
            throw new Error('No se pudo conectar con el servidor. Por favor, intenta más tarde.');
        }
    },

    async verifyToken(token) {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return await handleResponse(response);
    },

    async getProfile() {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return await handleResponse(response);
    },
};

// Servicios de items
export const apiService = {
    async getAllItems() {
        const response = await fetch(`${API_BASE_URL}/items`, {
            headers: getAuthHeaders(),
        });
        return await handleResponse(response);
    },

    async getItemById(id) {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            headers: getAuthHeaders(),
        });
        return await handleResponse(response);
    },

    async createItem(itemData) {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(itemData),
        });
        return await handleResponse(response);
    },

    async updateItem(id, itemData) {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(itemData),
        });
        return await handleResponse(response);
    },

    async deleteItem(id) {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return await handleResponse(response);
    },
};

