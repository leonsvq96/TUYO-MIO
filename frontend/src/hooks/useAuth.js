import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook helper: obtiene el contexto de auth o lanza error si no hay provider
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    
    return context;
};
