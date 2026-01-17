import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(emailOrUsername, password);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Iniciar Sesión</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailOrUsername">Usuario o Email</label>
                        <input
                            type="text"
                            id="emailOrUsername"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="auth-footer">
                    ¿No tienes cuenta? <a href="/register">Registrarse</a>
                </p>
            </div>
        </div>
    );
}
