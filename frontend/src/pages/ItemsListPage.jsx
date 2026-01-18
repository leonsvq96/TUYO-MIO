import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

export default function ItemsListPage() {
  // Estado principal: items completos, filtrados, loading/error y categoría por querystring
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');

  // Re-cargo cuando cambia la categoría en la URL
  useEffect(() => {
    loadItems();
  }, [categoryParam]);

  // Pido todos los items y filtro por categoría si viene en query
  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllItems();
      
      // Filtrar por categoría si existe el parámetro
      if (categoryParam) {
        const filtered = data.filter(item => item.category === categoryParam);
        setFilteredItems(filtered);
      } else {
        setFilteredItems(data);
      }
      
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar item con confirmación y refresco local
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await apiService.deleteItem(id);
        setItems(prevItems => prevItems.filter(item => item._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Cierro sesión y llevo al login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={loadItems}>Reintentar</button>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h1>Listado de Productos</h1>
        <div className="user-info">
          <span>Bienvenido, {user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      <div className="items-list">
        <div className="actions-bar">
          <button 
            onClick={() => navigate('/crear')} 
            className="btn-create"
          >
            Crear Producto
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <p className="no-items">No hay productos disponibles</p>
        ) : (
          <div className="items-grid">
            {filteredItems.map(({ _id, name, description, price, stock, category, createdBy }) => {
              // Verificar si el usuario puede editar/eliminar este item
              const canModify = user?.role === 'admin' || createdBy?._id === user?.id;
              
              return (
                <div key={_id} className="item-card">
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <p className="price">{price}€</p>
                  <p className="stock">Stock: {stock}</p>
                  <p className="category">{category}</p>
                  {createdBy && (
                    <p className="created-by">Por: {createdBy.username}</p>
                  )}
                  <div className="actions">
                    <button 
                      onClick={() => navigate(`/items/${_id}`)}
                      className="btn-edit"
                    >
                      Ver Detalles
                    </button>
                    {canModify && (
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(_id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
