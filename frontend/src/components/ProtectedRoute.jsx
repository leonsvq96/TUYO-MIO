import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Componente para proteger rutas: si no hay sesión, redirige a login

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <p>Cargando...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
