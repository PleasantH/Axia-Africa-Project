import { Request, Response } from "express";
import { Product } from "../schema/productSchema";
import { Order } from "../schema/orderSchema";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string; // "user" | "admin"
}

// Helper: extract user from token
const getUserFromToken = (req: Request): JwtPayload | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
};

// ✅ Create a new order (any logged-in user)
const createOrder = async (req: Request, res: Response) => {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      totalAmount += product.price * item.quantity;
    }

    const newOrder = new Order({
      user: userPayload.id,
      items,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get orders (admin: all orders, user: only their orders)
const getOrders = async (req: Request, res: Response) => {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let orders;
    if (userPayload.role === "admin") {
      orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "name price category");
    } else {
      orders = await Order.find({ user: userPayload.id })
        .populate("items.product", "name price category");
    }

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Update order status (admin: any order, user: only their own)
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // user can only update their own order
    if (userPayload.role !== "admin" && order.user.toString() !== userPayload.id) {
      return res.status(403).json({ message: "Access denied. Not your order." });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ❌ Delete an order (admin only)
const deleteOrder = async (req: Request, res: Response) => {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload || userPayload.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete orders" });
    }

    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    return res.status(200).json({ message: "Order deleted successfully", order });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export { createOrder, getOrders, updateOrderStatus, deleteOrder };
