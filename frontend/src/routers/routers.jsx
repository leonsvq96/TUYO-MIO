import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../Layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy loading de componentes
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ItemsListPage = lazy(() => import('../pages/ItemsListPage'));
const ItemsCreatePage = lazy(() => import('../pages/ItemsCreatePage'));
const ItemsDetailsPage = lazy(() => import('../pages/ItemsDetailsPage'));

// Componente de carga
function LoadingFallback() {
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

export default function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas */}
            <Route element={<Layout />}>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/productos" 
                element={
                  <ProtectedRoute>
                    <ItemsListPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crear" 
                element={
                  <ProtectedRoute>
                    <ItemsCreatePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/items/:id" 
                element={
                  <ProtectedRoute>
                    <ItemsDetailsPage />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

