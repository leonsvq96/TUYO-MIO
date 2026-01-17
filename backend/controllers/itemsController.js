import items from '../models/itemsModel.js';

const listItemsController = async (req, res) => {
    try {
        const allItems = await items.find().populate('createdBy', 'username email phone location');
        res.status(200).json(allItems);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
};

const getItemsController = async (req, res) => {
    try {
        const item = await items.findById(req.params.id).populate('createdBy', 'username email phone location');
        if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

const createItemsController = async (req, res) => {
    console.log('📦 Petición crear item recibida:', req.body);
    console.log('👤 Usuario autenticado:', req.user);
    try {
        const { name, description, price, stock, category, phone, location } = req.body;
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }
        const newItem = new items({ 
            name, 
            description, 
            price, 
            stock, 
            category, 
            phone: phone || '',
            location: location || '',
            creationDate: new Date(),
            createdBy: req.user.id
        });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error('❌ Error al crear item:', error);
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
};

const updateItemsController = async (req, res) => {
    try {
        const item = await items.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
        
        // Verificar permisos: admin puede editar todo, usuario solo sus propios items
        if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para editar este producto' });
        }
        
        // Permitir actualizar todos los campos incluyendo phone y location
        const { name, description, price, stock, category, phone, location } = req.body;
        if (name) item.name = name;
        if (description) item.description = description;
        if (price) item.price = price;
        if (stock) item.stock = stock;
        if (category) item.category = category;
        if (phone !== undefined) item.phone = phone;
        if (location !== undefined) item.location = location;
        
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
};

const deleteItemsController = async (req, res) => {
    try {
        const item = await items.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        // Verificar permisos: admin puede eliminar todo, usuario solo sus propios items
        if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
        }
        
        await item.deleteOne();
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
};

export {
    listItemsController,
    getItemsController,
    createItemsController,
    updateItemsController,
    deleteItemsController
};

