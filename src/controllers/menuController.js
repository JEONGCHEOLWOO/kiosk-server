import { getVerifiedUser } from "./userController.js";
import Menu from "../models/Menu.js";
import User from "../models/User.js";
import { bucket } from "./uploadController.js";

export const getCategoryMenu = async (req, res) => {
  const { id, password } = req.body;
  const { category1 } = req.body;
  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res
      .status(400)
      .json({ ok: false, msg: "wrong id or pw", data: { menus: [] } });
  }

  const popuUser = await User.findOne({ id }).populate("menus");
  let menuList = popuUser.menus;
  if (category1) {
    menuList = menuList.filter((menu) => {
      return String(menu.category1) === String(category1);
    });
  }

  return res
    .status(200)
    .json({ ok: true, msg: "good", data: { menus: menuList } });
};

export const getNameMenu = async (req, res) => {
  const { id, password } = req.body;
  const { name } = req.body;
  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res
      .status(400)
      .json({ ok: false, msg: "wrong id or pw", data: { menus: [] } });
  }

  const popuUser = await User.findOne({ id }).populate("menus");
  let menuList = popuUser.menus;

  menuList = menuList.filter((menu) => {
    return String(menu.name) === String(name);
  });

  if (menuList.length > 0) {
    return res
      .status(200)
      .json({ ok: true, msg: "good", data: { menu: menuList[0] } });
  } else {
    return res.status(400).json({
      ok: false,
      msg: "there is not this name's menu.",
      data: { menu: null },
    });
  }
};

export const getAllMenu = async (req, res) => {
  const { id, password } = req.body;
  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res
      .status(400)
      .json({ ok: false, msg: "wrong id or pw", data: { menus: [] } });
  }

  const popuUser = await User.findOne({ id }).populate("menus");
  return res
    .status(200)
    .json({ ok: true, msg: "good", data: { menus: popuUser.menus } });
};

export const addMenu = async (req, res) => {
  const { id, password } = req.body;
  const { name, text, price, imageURL, category1 } = req.body;

  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res.status(400).json({ ok: false, msg: "wrong id or pw" });
  }

  const popuUser = await User.findOne({ id }).populate("menus");
  let menuList = popuUser.menus;
  menuList = menuList.filter((menu) => {
    return String(menu.name) === String(name);
  });
  if (menuList.length > 0) {
    return res
      .status(400)
      .json({ ok: false, msg: "There is already this name's menu." });
  }

  try {
    const menu = await Menu.create({
      owner: verifiedUser._id,
      name,
      text,
      price,
      imageURL,
      category1,
    });
    await verifiedUser.menus.push(menu._id);
    await verifiedUser.save();
    return res.status(200).json({ ok: true, msg: "good" });
  } catch (error) {
    return res.status(400).json({ ok: false, msg: error });
  }
};

export const removeMenu = async (req, res) => {
  const { id, password } = req.body;
  const { name } = req.body;
  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res.status(400).json({ ok: false, msg: "wrong id or pw" });
  }
  try {
    const popuUser = await User.findOne({ id }).populate("menus");
    let menuList = popuUser.menus;
    menuList = menuList.filter((menu) => {
      return String(menu.name) === String(name);
    });
    if (menuList.length == 0) {
      return res
        .status(400)
        .json({ ok: false, msg: "There is not this menu." });
    }

    let menu = await Menu.findOne({ name });
    if (!menu) {
      return res.status(400).json({ ok: false, msg: "no menu" });
    }
    menu = await Menu.findOne({ name }).populate("owner");
    const menuId = menu._id;
    menu.owner.menus = menu.owner.menus.filter((_id) => {
      return String(_id) != String(menuId);
    });
    await menu.owner.save();

    // Firebase Storage에서 파일 삭제
    const urlSplit = menu.imageURL.split("=");
    const fileName = urlSplit[urlSplit.length - 1];
    console.log(fileName);
    const file = bucket.file(fileName);
    await file.delete();

    await Menu.findByIdAndDelete(menuId);
    return res.status(200).json({ ok: true, msg: "good" });
  } catch (error) {
    return res.status(400).json({ ok: false, msg: "error" });
  }
};
