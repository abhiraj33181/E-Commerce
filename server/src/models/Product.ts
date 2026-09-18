import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '../../types/index.js';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{ type: String }],
    price: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        enum: PRODUCT_CATEGORIES,
        required: true
    },
    sizes : {
        type : [String],
        default : []
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;