import { Router } from "express";
import { createProduct, getAllProducts, getAProductByCategory, deleteAProduct, getProductById } from "../controllers/productController";


const productRouter = Router();

// Route for creating a product
productRouter.post("/", createProduct);
productRouter.get("/all", getAllProducts);
productRouter.get("/category/:category", getAProductByCategory);
productRouter.get("/:id", getProductById);
productRouter.delete("/:id", deleteAProduct);

export default productRouter;
