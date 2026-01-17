import express from 'express';
import { 
    registerController, 
    loginController, 
    getProfileController,
    updateProfileController,
    verifyTokenController
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registerController);
router.post('/login', loginController);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticate, getProfileController);
router.put('/profile', authenticate, updateProfileController);
router.get('/verify', authenticate, verifyTokenController);

export default router;
