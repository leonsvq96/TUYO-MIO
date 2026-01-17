import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

export default function ItemsCreatePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await apiService.createItem({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      });
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-create">
      <h1>Crear Nuevo Producto</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
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
              min="0"
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
              min="0"
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
            <label htmlFor="phone">Teléfono de contacto del anuncio</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="666 123 456"
              value={formData.phone}
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
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')}
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
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
