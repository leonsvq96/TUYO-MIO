import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

const getCategoryIcon = (category) => {
    const icons = {
        'Electrónica': '📱',
        'Televisiones': '📺',
        'Ordenadores': '💻',
        'Móviles': '☎️',
        'Auriculares': '🎧',
        'Consolas': '🎮',
        'Libros': '📚',
        'Ropa': '👕',
        'Zapatos': '👟',
        'Accesorios': '👜',
        'Joyas': '💎',
        'Relojes': '⌚',
        'Casa': '🏠',
        'Muebles': '🛋️',
        'Decoración': '🎨',
        'Cocina': '🍳',
        'Deportes': '⚽',
        'Bicicletas': '🚴',
        'Monopatines': '🛹',
        'Juguetes': '🧸',
        'Mascotas': '🐕',
        'Salud': '⚕️',
        'Belleza': '💄',
        'Vehículos': '🚗',
        'Motor': '🏍️',
        'Herramientas': '🔧',
        'Construcción': '🏗️',
        'Jardín': '🌿',
        'Música': '🎸',
        'Instrumentos': '🎹',
        'Arte': '🖼️',
        'Cine': '🎬',
        'Fotografía': '📷',
        'Viajes': '✈️',
        'Turismo': '🗺️',
        'Oficina': '📋',
        'Educación': '🎓',
        'Servicios': '💼',
        'Otros': '📦'
    };
    return icons[category] || '📦';
};

const HomePage = () => {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchFeaturedItems();
    }, []);

    const fetchFeaturedItems = async () => {
        try {
            const data = await apiService.getAllItems();
            // Mostrar solo los primeros 6 productos destacados
            setFeaturedItems(data.slice(0, 6));
            
            // Extraer categorías únicas
            const uniqueCategories = [...new Set(data.map(item => item.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewProduct = (id) => {
        navigate(`/items/${id}`);
    };

    const handleViewAllProducts = () => {
        navigate('/productos');
    };

    const handleViewCategory = (category) => {
        navigate(`/productos?category=${encodeURIComponent(category)}`);
    };

    const handleCreateProduct = () => {
        navigate('/crear');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <h2>Cargando...</h2>
            </div>
        );
    }

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Bienvenido a TUYO &amp; MIO</h1>
                    <p className="hero-subtitle">
                        Compra y vende entre particulares de forma fácil y segura
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={handleViewAllProducts}>
                            Ver Todos los Anuncios
                        </button>
                        <button className="btn-secondary" onClick={handleCreateProduct}>
                            Publicar Anuncio
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="categories-section">
                    <h2>Categorías</h2>
                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <div key={index} className="category-card" onClick={() => handleViewCategory(category)}>
                                <div className="category-icon">{getCategoryIcon(category)}</div>
                                <h3>{category}</h3>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Anuncios Destacados</h2>
                    <button className="btn-link" onClick={handleViewAllProducts}>
                        Ver todos →
                    </button>
                </div>
                
                {featuredItems.length === 0 ? (
                    <div className="no-items">
                        <p>No hay anuncios disponibles</p>
                        <button className="btn-primary" onClick={handleCreateProduct}>
                            Publicar Primer Anuncio
                        </button>
                    </div>
                ) : (
                    <div className="featured-grid">
                        {featuredItems.map((item) => (
                            <div 
                                key={item._id} 
                                className="featured-card"
                                onClick={() => handleViewProduct(item._id)}
                            >
                                <div className="featured-card-header">
                                    <h3>{item.name}</h3>
                                    <span className="featured-price">{item.price}€</span>
                                </div>
                                <p className="featured-description">
                                    {item.description.substring(0, 80)}
                                    {item.description.length > 80 ? '...' : ''}
                                </p>
                                <div className="featured-footer">
                                    <span className="featured-category">{item.category}</span>
                                    <span className={`featured-stock ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {item.stock > 0 ? `${item.stock} disponibles` : 'Sin stock'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <h3>{featuredItems.length}+</h3>
                    <p>Anuncios</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🤝</div>
                    <h3>100%</h3>
                    <p>Entre particulares</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <h3>24/7</h3>
                    <p>Disponible</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
