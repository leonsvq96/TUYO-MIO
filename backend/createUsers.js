import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel.js';

dotenv.config();

const createUsers = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas');

        // Usuario Admin
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        // Usuario Normal
        const normalUser = new User({
            username: 'usuario',
            email: 'usuario@example.com',
            password: 'usuario123',
            role: 'user'
        });

        // Verificar si ya existen
        const adminExists = await User.findOne({ username: 'admin' });
        const userExists = await User.findOne({ username: 'usuario' });

        if (adminExists) {
            console.log('⚠️  Usuario admin ya existe');
        } else {
            await adminUser.save();
            console.log('✅ Usuario admin creado:');
            console.log('   username: admin');
            console.log('   email: admin@example.com');
            console.log('   password: admin123');
            console.log('   role: admin');
        }

        if (userExists) {
            console.log('⚠️  Usuario normal ya existe');
        } else {
            await normalUser.save();
            console.log('\n✅ Usuario normal creado:');
            console.log('   username: usuario');
            console.log('   email: usuario@example.com');
            console.log('   password: usuario123');
            console.log('   role: user');
        }

        // Mostrar todos los usuarios
        const allUsers = await User.find({});
        console.log('\n📊 Total de usuarios en la BD:', allUsers.length);
        console.log('usuarios:', allUsers.map(u => ({
            username: u.username,
            email: u.email,
            role: u.role
        })));

        await mongoose.connection.close();
        console.log('\n✅ Desconectado de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

createUsers();
