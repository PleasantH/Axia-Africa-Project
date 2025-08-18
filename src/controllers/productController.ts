import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Product } from "../schema/productSchema";
import { User } from "../schema/User";

// Define Product creation request body interface
interface CreateProductBody {
  name: string;
  price: number;
  category: string;
  quantity: number;
}

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}

// 🔹 Utility to extract and validate JWT, returning user object
const authenticateAdmin = async (req: AuthRequest, res: Response): Promise<any | null> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return null;
  }

  const userId = decoded.id || decoded.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }

  if (user.userType !== "admin") {
    res.status(403).json({ message: "Access denied. Only admins can perform this action." });
    return null;
  }

  req.userId = userId;
  return user;
};

// 🔹 Create Product (Admin only)
const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authenticateAdmin(req, res);
    if (!user) return; // stop execution if not admin

    const { name, price, category, quantity } = req.body;

    if (!name || !price || !category || !quantity) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      quantity,
      createdBy: req.userId,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🔹 Get all products
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🔹 Get products by category
const getAProductByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ category });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    return res.status(200).json({
      message: `Products retrieved successfully in category: ${category}`,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🔹 Get product by ID
const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product retrieved successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🔹 Update a product (Admin only)
const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authenticateAdmin(req, res);
    if (!user) return;

    const { id } = req.params;
    const { name, price, category, quantity } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, category, quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🔹 Delete a product (Admin only)
const deleteAProduct = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authenticateAdmin(req, res);
    if (!user) return;

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  createProduct,
  getAllProducts,
  getAProductByCategory,
  getProductById,
  updateProduct,
  deleteAProduct,
};
