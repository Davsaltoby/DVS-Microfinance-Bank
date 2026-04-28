import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    bvn: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
