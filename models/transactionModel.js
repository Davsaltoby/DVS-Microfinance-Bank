import mongoose from "mongoose";
import User from "./userModel.js";

const { Schema } = mongoose;
const transactionSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      default: null,
    },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    status: {
      type: String,
      enum: ["failed", "pending", "success"],
      required: true,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
