import { Request, Response } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// Get User Orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const query = { user: req.user._id };
    const orders = await Order.find(query)
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching orders",
    });
  }
};

// Get Single Order
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name images price",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    res.json({ success: true, data: order });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching order",
    });
  }
};

// Create order from Cart
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { shippingAddress, notes } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Verify Stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${(item.product as any).name}`,
        });
      }
      orderItems.push({
        product: item.product._id,
        name: (item.product as any).name,
        quantity: item.quantity,
        price: product.price ?? 0,
      });

      // Reduce Stock
      product.stock -= item.quantity;
      await product.save();
    }

    const subtotal = cart.totalAmount;
    const shippingCost = 2;
    const tax = 0;
    const totalAmount = subtotal + shippingCost + tax;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: req.body.paymentMethod || "cash",
      paymentStatus: "pending",
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      notes,
      paymentIntentId: req.body.paymentIntentId,
      orderNumber: `ORD-${Date.now()}`,
    });

    if (req.body.paymentMethod !== "stripe") {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating order",
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus === "delivered") order.deliveredAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating order status",
    });
  }
};

// Get all orders (Admin)

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query: any = {};
    if (status) {
      query.orderStatus = status;
    }
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: orders,
      pagination : {total, page: Number(page), pages: Math.ceil(total / Number(limit))},
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching all orders",
    });
  }
};
