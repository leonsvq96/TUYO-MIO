import express from 'express';
import { 
    listItemsController, 
    getItemsController, 
    createItemsController, 
    updateItemsController, 
    deleteItemsController 
} from '../controllers/itemsController.js';
import { authenticate } from '../middlewares/auth.js';

// Rutas CRUD de productos con auth obligatoria

const router = express.Router();

router.get('/', authenticate, listItemsController);          // listar
router.get('/:id', authenticate, getItemsController);        // detalle
router.post('/', authenticate, createItemsController);       // crear
router.put('/:id', authenticate, updateItemsController);     // actualizar
router.delete('/:id', authenticate, deleteItemsController);  // eliminar

export default router;