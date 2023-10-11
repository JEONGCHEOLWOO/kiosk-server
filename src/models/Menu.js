import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  text: { type: String, required: true },
  price: { type: Number, required: true },
  imageURL: { type: String, required: true },
  category1: { type: String, required: true },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
