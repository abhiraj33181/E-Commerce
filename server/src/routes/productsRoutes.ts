import express from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, wishlistProduct, getWishlistProducts } from '../controller/productController.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';


const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.get('/wishlist', auth, getWishlistProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', upload.array('images', 5), auth, createProduct);
productRouter.put('/:id', upload.array('images', 5), auth, updateProduct);
productRouter.delete('/:id', auth, deleteProduct);
productRouter.patch('/:id', auth, wishlistProduct);

export default productRouter;