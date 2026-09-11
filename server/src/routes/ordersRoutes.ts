import express from "express";
import { auth } from "../middleware/auth.js";
import { getOrders, getOrderById, createOrder, updateOrderStatus, getAllOrders } from "../controller/ordersController.js";


const OrderRouter = express.Router();


// Get User Orders
OrderRouter.get('/', auth, getOrders);

// Get Single Order
OrderRouter.get('/:id', auth, getOrderById);

// Create order from Cart
OrderRouter.post('/', auth, createOrder);

// Update order status (Admin only)
OrderRouter.put('/:id/status', auth, updateOrderStatus);

// Get all orders (Admin only)
OrderRouter.get('/admin/all', auth, getAllOrders);



export default OrderRouter;

