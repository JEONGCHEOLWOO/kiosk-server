import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  waitings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Waiting" }],
});

const User = mongoose.model("User", userSchema);

export default User;
