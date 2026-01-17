import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    creationDate: { type: Date, required: true },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
});

const items = mongoose.model('items', itemsSchema);
export default items;
