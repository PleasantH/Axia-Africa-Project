import { Router } from "express";
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController";

const orderRouter = Router();

orderRouter.post("/create", createOrder);
orderRouter.get("/all", getOrders);
orderRouter.patch("/update-status/:id", updateOrderStatus);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
