import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './middlewares/logs.js';
import notFound from './middlewares/404.js';
import internalServerError from './middlewares/500.js';
import itemsRouter from './routers/itemsRouter.js';
import authRouter from './routers/authRouter.js';
import indexController from './controllers/indexController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://tuyo-mio.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB conectado correctamente');
    } catch (err) {
        console.error('❌ Error al conectar MongoDB:', err.message);
        process.exit(1);
    }
};

connectDB();

// Rutas
app.get('/', indexController);
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);

// Middlewares de error (deben ir al final)
app.use(notFound);
app.use(internalServerError);

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}

export default app;
