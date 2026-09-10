import express from "express";
import { auth } from "../middleware/auth.js";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controller/cartController.js";


const cartRouter = express.Router();

cartRouter.get("/", auth, getCart);
cartRouter.post("/add", auth, addToCart);
cartRouter.put("/item/:productId", auth, updateCartItem);
cartRouter.delete("/item/:productId", auth, removeCartItem);
cartRouter.delete("/clear", auth, clearCart);``


export default cartRouter;

