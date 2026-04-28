import mongoose from "mongoose";
import User from "./userModel.js";

const { Schema } = mongoose;
const accountSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    accountNumber: { type: String, required: true, unique: true },
    bankCode: { type: String, required: true },
    accountBalance: { type: Number, required: true },
  },
  { timestamps: true },
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
