import { Request, Response } from "express";
import { Product } from "../schema/productSchema";

// Define Product creation request body interface
interface CreateProductBody {
  name: string;
  price: number;
  category: string;
  quantity: number;
}

const createProduct = async (req: Request<{}, {}, CreateProductBody>, res: Response) => {
  try {
    const { name, price, category, quantity } = req.body;

    if (!name || !price || !category || !quantity) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // If you want to check duplicates by name instead of ID:
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    console.log("Creating product with name:", name);

    const newProduct = new Product({
      name,
      price,
      category,
      quantity,
    });

    console.log("New product created:", newProduct);

    const savedProduct = await newProduct.save();

    console.log("Product saved successfully:", savedProduct);

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

// Get all products
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

// Get products by category
const getAProductByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params; // from route: /category/:category

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


//Get a product by ID
const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // from route: /product/:id

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


// Delete a product by ID
const deleteAProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // from route: /delete/:id

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


export { createProduct, getAllProducts, getAProductByCategory, getProductById, deleteAProduct };
