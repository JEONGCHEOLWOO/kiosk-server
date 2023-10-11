import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
  tableNum: { type: Number, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 9 * 60 * 60 * 1000), // 9 hours for KST
  },
  status: {
    type: Number,
    required: true,
    default: 0,
    // 0: 주문 대기. -1: 주문 취소, 1: 주문 완료
  },
  // totalPrice: { type: Number, required: true },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
