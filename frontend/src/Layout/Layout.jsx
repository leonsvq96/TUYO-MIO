import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Layout = () => {
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <img src="/logo%20(1).svg" alt="TUYO & MIO" className="logo-image" />
                        <span>TUYO &amp; MIO</span>
                    </Link>
                    <div className="nav-right">
                        <div className="nav-menu">
                            <Link to="/productos" className="nav-link">
                                Anuncios
                            </Link>
                            <Link to="/crear" className="nav-link">
                                Publicar Anuncio
                            </Link>
                        </div>

                        {isAuthenticated ? (
                            <div className="user-pill" title={user?.email || user?.username}>
                                <div className="user-avatar">
                                    {user?.username?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{user?.username || "Usuario"}</span>
                                    <button type="button" className="logout-btn" onClick={handleLogout}>
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="auth-links">
                                <Link to="/login" className="nav-link">Iniciar sesión</Link>
                                <Link to="/register" className="btn-primary nav-cta">Crear cuenta</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="footer">
                <p>&copy; 2026 TUYO &amp; MIO. Todos los derechos reservados.</p>
            </footer>
        </>
    );
}

export default Layout;