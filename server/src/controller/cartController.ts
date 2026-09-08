import { Request, Response } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get User Cart
export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name images price stock",
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching cart",
    });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // find item with the same product and size
    const existingItem = cart.items.find((item) => {
      return item.product.toString() === productId && item.size === size;
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price!;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        price: product.price!,
      });
    }

    cart.calculateTotal();
    await cart.save();

    await cart.populate("items.product", "name images price stock");

    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error adding item to cart",
    });
  }
};

// Update Cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { quantity, size } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((item) => {
      return item.product.toString() === productId && item.size === size;
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => {
        return item.product.toString() !== productId;
      });
    } else {
      const product = await Product.findById(productId);
      if (product!.stock < quantity) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient stock" });
      }
      item.quantity = quantity;
    }

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product", "name images price stock");
    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating cart item",
    });
  }
};

// Remove Item from Cart
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { size } = req.query;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || !size) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => {
      return (
        item.product.toString() !== req.params.productId || item.size !== size
      );
    });

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product", "name images price stock");
    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error removing item from cart",
    });
  }
};

// Clear Cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product", "name images price stock");
    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error clearing cart",
    });
  }
};
