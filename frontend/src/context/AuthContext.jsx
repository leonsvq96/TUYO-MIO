import { createContext, useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../const/constants';
import { authService } from '../services/apiService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN));
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verificar token al cargar la aplicación
    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await authService.verifyToken(token);
                    setUser(response.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token inválido o expirado
                    logout();
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, [token]);

    const login = async (emailOrUsername, password) => {
        try {
            const response = await authService.login(emailOrUsername, password);
            const { token: newToken, user: userData } = response;
            
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
            
            localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, newToken);
            localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Error al iniciar sesión' 
            };
        }
    };

    const register = async (username, email, password, phone = '', location = '') => {
        try {
            const response = await authService.register(username, email, password, phone, location);
            const { token: newToken, user: userData } = response;
            
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
            
            localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, newToken);
            localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Error al registrar usuario' 
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
