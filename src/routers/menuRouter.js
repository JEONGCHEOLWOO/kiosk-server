import express from "express";
import {
  addMenu,
  getAllMenu,
  getCategoryMenu,
  getNameMenu,
  removeMenu,
} from "../controllers/menuController.js";
import { upload, uploadSave } from "../controllers/uploadController.js";

const menuRouter = express.Router();

menuRouter.post("/add", upload.single("imageFile"), uploadSave, addMenu);
menuRouter.post("/remove", removeMenu);

menuRouter.post("/category", getCategoryMenu);
menuRouter.post("/name", getNameMenu);
menuRouter.post("/", getAllMenu);

export default menuRouter;
