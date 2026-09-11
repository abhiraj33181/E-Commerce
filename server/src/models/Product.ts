import mongoose from 'mongoose';

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
        enum: ["Men", "Women", "Kids", "Shoes", "Bags", "Other"],
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