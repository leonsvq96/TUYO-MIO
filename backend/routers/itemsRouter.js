rm -r .gitimport express from 'express';
import { 
    listItemsController, 
    getItemsController, 
    createItemsController, 
    updateItemsController, 
    deleteItemsController 
} from '../controllers/itemsController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, listItemsController);
router.get('/:id', authenticate, getItemsController);
router.post('/', authenticate, createItemsController);
router.put('/:id', authenticate, updateItemsController);
router.delete('/:id', authenticate, deleteItemsController);

export default router;