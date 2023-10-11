import express from "express";
import {
  approvePay,
  payCancel,
  payFail,
  payFinalFail,
  payFinalSuccess,
  paySuccess,
  readyPay,
} from "../controllers/payController.js";

const payRouter = express.Router();

payRouter.get("/success", paySuccess);
payRouter.get("/cancel", payCancel);
payRouter.get("/fali", payFail);
payRouter.get("/finalSuccess", payFinalSuccess);
payRouter.get("/finalFail", payFinalFail);

payRouter.post("/ready", readyPay);
payRouter.post("/approve", approvePay);

export default payRouter;
