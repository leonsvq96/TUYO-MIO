import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

// Página de detalle: muestra info y permite editar si eres dueño/admin

export default function ItemsDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    phone: '',
    location: ''
  });

  // Cargo el producto cuando cambia el id de la ruta
  useEffect(() => {
    loadItem();
  }, [id]);

  // Traigo el detalle y relleno el formulario con lo que llega
  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await apiService.getItemById(id);
      setItem(data);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category,
        phone: data.phone || '',
        location: data.location || ''
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo el cambio de inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardo el producto editado
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await apiService.updateItem(id, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      });
      
      setIsEditing(false);
      await loadItem();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Estados de carga y error iniciales
  if (loading && !item) {
    return (
      <div className="loading-container">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={loadItem}>Reintentar</button>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="error-container">
        <p>Producto no encontrado</p>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  return (
    <div className="items-details">
      <h1>Detalles del Producto</h1>

      {error && <div className="error-message">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono del anuncio</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="666 123 456"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Ubicación del artículo</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Madrid, Barcelona..."
                value={formData.location || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      ) : (
        <div className="detail-card">
          <h2>{item.name}</h2>
          <p className="description">{item.description}</p>
          
          <div className="details-info">
            <div className="info-item">
              <span className="label">Precio:</span>
              <span className="value price">{item.price}€</span>
            </div>
            <div className="info-item">
              <span className="label">Stock:</span>
              <span className="value">{item.stock} unidades</span>
            </div>
            <div className="info-item">
              <span className="label">Categoría:</span>
              <span className="value">{item.category}</span>
            </div>
            {item.location && (
              <div className="info-item">
                <span className="label">📍 Ubicación del artículo:</span>
                <span className="value">{item.location}</span>
              </div>
            )}
            {item.phone && (
              <div className="info-item">
                <span className="label">☎️ Teléfono del anuncio:</span>
                <span className="value"><a href={`tel:${item.phone}`}>{item.phone}</a></span>
              </div>
            )}
            <div className="info-item">
              <span className="label">Fecha de creación:</span>
              <span className="value">
                {new Date(item.creationDate).toLocaleDateString('es-ES')}
              </span>
            </div>
            {item.createdBy && (
              <div className="info-item">
                <span className="label">Creado por:</span>
                <span className="value">{item.createdBy.username}</span>
              </div>
            )}
          </div>

          {/* Información del vendedor */}
          {item.createdBy && (
            <div className="seller-contact">
              <h3>📞 Contactar con el vendedor</h3>
              <div className="seller-info">
                <p><strong>Vendedor:</strong> {item.createdBy.username}</p>
                {item.createdBy.location && (
                  <p><strong>📍 Ubicación:</strong> {item.createdBy.location}</p>
                )}
                {item.createdBy.phone && (
                  <p><strong>☎️ Teléfono:</strong> <a href={`tel:${item.createdBy.phone}`}>{item.createdBy.phone}</a></p>
                )}
                {!item.createdBy.phone && !item.createdBy.location && (
                  <p className="no-contact">El vendedor no ha proporcionado información de contacto</p>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              onClick={() => navigate('/productos')}
              className="btn-secondary"
            >
              Volver
            </button>
            {(user?.role === 'admin' || item.createdBy?._id === user?.id) && (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
