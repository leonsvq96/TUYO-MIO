import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel.js';

dotenv.config();

const updateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas');

        // Actualizar usuarios
        await User.updateOne(
            { username: 'admin' },
            { $set: { phone: '666 123 456', location: 'Madrid' } }
        );

        await User.updateOne(
            { username: 'usuario' },
            { $set: { phone: '677 987 654', location: 'Barcelona' } }
        );

        const users = await User.find().select('-password');
        console.log('\n👤 Usuarios actualizados:');
        users.forEach(user => {
            console.log(`  - ${user.username}: ${user.phone} (${user.location})`);
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

updateUsers();
