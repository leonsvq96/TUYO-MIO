import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Controlador de auth: registro, login, perfil y verificación

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generar token JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Registro de usuario
const registerController = async (req, res) => {
    console.log('📥 Petición de registro recibida:', req.body);
    try {
        const { username, email, password, phone, location, role } = req.body;

        // Validar datos
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Todos los campos son requeridos' 
            });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (userExists) {
            return res.status(400).json({ 
                message: 'El usuario o email ya existe' 
            });
        }

        // Crear usuario
        const newUser = new User({ 
            username, 
            email, 
            password,
            phone: phone || '',
            location: location || '',
            role: role || 'user'
        });

        console.log('Intentando guardar usuario:', { username, email, phone, location });
        await newUser.save();
        console.log('Usuario guardado exitosamente');

        // Generar token
        const token = generateToken(newUser._id);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                location: newUser.location,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            message: 'Error al registrar usuario', 
            error: error.message,
            details: error.toString()
        });
    }
};

// Login de usuario
const loginController = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Validar datos
        if (!emailOrUsername || !password) {
            return res.status(400).json({ 
                message: 'Email/username y contraseña son requeridos' 
            });
        }

        // Buscar usuario por email o username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });

        if (!user) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(401).json({ 
                message: 'Usuario inactivo' 
            });
        }

        // Verificar contraseña
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Generar token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al iniciar sesión', 
            error: error.message 
        });
    }
};

// Obtener perfil del usuario autenticado
const getProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener perfil', 
            error: error.message 
        });
    }
};

// Actualizar perfil del usuario
const updateProfileController = async (req, res) => {
    try {
        const { username, email, phone, location } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar campos
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;

        await user.save();

        res.status(200).json({
            message: 'Perfil actualizado correctamente',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                location: user.location,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar perfil', 
            error: error.message 
        });
    }
};

// Verificar token
const verifyTokenController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        }

        res.status(200).json({
            valid: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                location: user.location,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al verificar token', 
            error: error.message 
        });
    }
};

export {
    registerController,
    loginController,
    getProfileController,
    updateProfileController,
    verifyTokenController
};
