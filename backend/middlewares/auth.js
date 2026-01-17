import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

// Middleware para verificar autenticación
const authenticate = async (req, res, next) => {
    console.log('🔐 Verificando autenticación...');
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ Token no proporcionado');
            return res.status(401).json({ 
                message: 'Token no proporcionado' 
            });
        }

        const token = authHeader.substring(7); // Quitar "Bearer "

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Buscar usuario
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log('❌ Usuario no encontrado');
            return res.status(401).json({ 
                message: 'Usuario no encontrado' 
            });
        }

        if (!user.isActive) {
            console.log('❌ Usuario inactivo');
            return res.status(401).json({ 
                message: 'Usuario inactivo' 
            });
        }

        // Agregar usuario a la request
        req.user = user;
        console.log('✅ Usuario autenticado:', user.username);
        next();
    } catch (error) {
        console.error('❌ Error en autenticación:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Token inválido' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expirado' 
            });
        }
        res.status(500).json({ 
            message: 'Error en autenticación', 
            error: error.message 
        });
    }
};

// Middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            message: 'Acceso denegado. Se requieren permisos de administrador' 
        });
    }
};

export { authenticate, isAdmin };
export default authenticate;
