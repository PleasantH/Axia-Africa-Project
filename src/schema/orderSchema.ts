import mongoose, { Schema, Document, Types } from "mongoose";

//Order Item Interface
interface IOrderItem {
  product: Types.ObjectId; // Reference to Product
  quantity: number;
  price: number; // snapshot of product price at time of order
}

//Order Interface
export interface IOrder extends Document {
  user: Types.ObjectId; // Reference to User
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "successful" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

//Order Schema
const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "successful", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// 🔹 Export Order Model
const Order = mongoose.model<IOrder>("Order", orderSchema);

export { Order };
