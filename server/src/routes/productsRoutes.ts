import express from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controller/productController.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';


const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', upload.array('images', 5), auth, createProduct);
productRouter.put('/:id', upload.array('images', 5), auth, updateProduct);
productRouter.delete('/:id', auth, deleteProduct);

export default productRouter;