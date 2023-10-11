import express from "express";
import {
  addOrder,
  changeOrderStatus,
  dayOrder,
  getAllOrder,
  monthOrder,
  removeOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/add", addOrder);
orderRouter.post("/remove", removeOrder);
orderRouter.post("/changeStatus", changeOrderStatus);
orderRouter.post("/dayOrder", dayOrder);
orderRouter.post("/monthOrder", monthOrder);

orderRouter.post("/", getAllOrder);

export default orderRouter;
