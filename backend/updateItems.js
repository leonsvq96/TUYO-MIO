import dotenv from 'dotenv';
import mongoose from 'mongoose';
import items from './models/itemsModel.js';
import User from './models/userModel.js';

dotenv.config();

const updateExistingItems = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas');

        // Buscar el usuario admin
        const adminUser = await User.findOne({ username: 'admin' });
        
        if (!adminUser) {
            console.log('❌ Usuario admin no encontrado. Ejecuta createUsers.js primero');
            process.exit(1);
        }

        // Actualizar todos los items que no tienen createdBy
        const result = await items.updateMany(
            { createdBy: { $exists: false } },
            { $set: { createdBy: adminUser._id } }
        );

        console.log(`✅ ${result.modifiedCount} productos actualizados con creador: admin`);

        // Mostrar todos los items
        const allItems = await items.find().populate('createdBy', 'username');
        console.log('\n📦 Productos en la base de datos:');
        allItems.forEach(item => {
            console.log(`  - ${item.name} (Creado por: ${item.createdBy?.username || 'Sin asignar'})`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Desconectado de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

updateExistingItems();
