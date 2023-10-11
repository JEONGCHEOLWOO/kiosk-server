import Order from "../models/Order.js";
import User from "../models/User.js";
import { getVerifiedUser } from "./userController.js";

export const addOrder = async (req, res) => {
  const { id, password } = req.body;
  const { name, tableNum } = req.body;

  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res.status(400).json({ ok: false, msg: "wrong id or pw" });
  }

  const popuUser = await User.findOne({ id })
    .populate("orders")
    .populate("menus");
  let menuList = popuUser.menus;
  menuList = menuList.filter((menu) => {
    return String(menu.name) === String(name);
  });
  if (menuList.length === 0) {
    return res
      .status(400)
      .json({ ok: false, msg: "There is not this name's menu." });
  }

  try {
    const order = await Order.create({
      owner: verifiedUser._id,
      menu: menuList[0]._id,
      tableNum,
    });
    await verifiedUser.orders.push(order._id);
    await verifiedUser.save();
    return res.status(200).json({ ok: true, msg: "good" });
  } catch (error) {
    return res.status(400).json({ ok: false, msg: "error" });
  }
};

export const removeOrder = async (req, res) => {
  const { id, password } = req.body;
  const { orderId } = req.body;

  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res.status(400).json({ ok: false, msg: "wrong id or pw" });
  }

  try {
    if (!verifiedUser.orders.includes(orderId)) {
      return res
        .status(400)
        .json({ ok: false, msg: "can't find this id in this account" });
    }

    let order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(400).json({ ok: false, msg: "can't find this id" });
    }
    order = await Order.findOne({ _id: orderId }).populate("owner");
    order.owner.orders = order.owner.orders.filter((_id) => {
      return String(_id) !== String(orderId);
    });
    await order.owner.save();
    await Order.findByIdAndDelete(orderId);
    return res.status(200).json({ ok: true, msg: "good" });
  } catch (error) {
    return res.status(400).json({ ok: false, msg: error });
  }
};

export const getAllOrder = async (req, res) => {
  const { id, password } = req.body;
  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res
      .status(400)
      .json({ ok: false, msg: "wrong id or pw", data: { orders: [] } });
  }

  const popuUser = await User.findOne({ id })
    .populate({
      path: "orders",
      populate: {
        path: "menu",
      },
    })
    .exec();
  return res
    .status(200)
    .json({ ok: true, msg: "good", data: { orders: popuUser.orders } });
};

export const changeOrderStatus = async (req, res) => {
  const { id, password } = req.body;
  const { orderId, status } = req.body;

  if (status !== -1 && status !== 0 && status !== 1) {
    return res
      .status(400)
      .json({ ok: false, msg: "Status can only be one of -1, 0, 1" });
  }

  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res.status(400).json({ ok: false, msg: "wrong id or pw" });
  }

  try {
    if (!verifiedUser.orders.includes(orderId)) {
      return res
        .status(400)
        .json({ ok: false, msg: "can't find this id in this account" });
    }

    let order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(400).json({ ok: false, msg: "can't find this id" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ ok: true, msg: "good" });
  } catch (error) {
    return res.status(400).json({ ok: false, msg: error });
  }
};

export const dayOrder = async (req, res) => {
  const { year, month, day } = req.body;

  if (!year || !month || !day) {
    res
      .status(400)
      .json({ ok: false, msg: "연도, 월, 일이 필요합니다.", data: {} });
    return;
  }

  const { id, password } = req.body;
  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res.status(400).json({ ok: false, msg: "wrong id or pw", data: {} });
  }

  const fromDate = new Date(Date.UTC(year, month - 1, day));
  const toDate = new Date(fromDate);

  toDate.setDate(toDate.getDate() + 1);

  try {
    const user = await User.findOne({ id })
      .populate({
        path: "orders",
        populate: {
          path: "menu",
        },
      })
      .exec();

    const { orders } = user;

    const filteredOrders = orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= fromDate && createdAt < toDate;
    });

    const nameCount = new Map();
    let totalPrice = 0;

    filteredOrders.forEach((order) => {
      if (order.status != 1) {
        return;
      }
      if (order.menu) {
        const menuItem = order.menu;
        if (menuItem.name && menuItem.price) {
          if (nameCount.has(menuItem.name)) {
            nameCount.set(menuItem.name, nameCount.get(menuItem.name) + 1);
          } else {
            nameCount.set(menuItem.name, 1);
          }

          totalPrice += menuItem.price;
        }
      }
    });

    const sortedNameCount = new Map(
      [...nameCount.entries()].sort((a, b) => b[1] - a[1])
    );

    const formattedTotalPrice = totalPrice.toLocaleString("en-US");

    const response = {
      count: Object.fromEntries(sortedNameCount),
      totalPrice: formattedTotalPrice,
    };

    return res.status(200).json({ ok: true, msg: "good", data: response });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ ok: false, msg: err, data: {} });
  }
};

export const monthOrder = async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    res
      .status(400)
      .json({ ok: false, msg: "연도, 월이 필요합니다.", data: {} });
    return;
  }

  const { id, password } = req.body;
  const verifiedUser = await getVerifiedUser(id, password);
  if (!verifiedUser) {
    return res.status(400).json({ ok: false, msg: "wrong id or pw", data: {} });
  }

  const fromDate = new Date(Date.UTC(year, month - 1, 1));
  const toDate = new Date(
    Date.UTC(year + (month / 12 >= 1 ? 1 : 0), month % 12, 1)
  );

  try {
    const user = await User.findOne({ id })
      .populate({
        path: "orders",
        populate: {
          path: "menu",
        },
      })
      .exec();

    const { orders } = user;

    const filteredOrders = orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= fromDate && createdAt < toDate;
    });

    const nameCount = new Map();
    let totalPrice = 0;

    filteredOrders.forEach((order) => {
      if (order.status != 1) {
        return;
      }
      if (order.menu) {
        const menuItem = order.menu;
        if (menuItem.name && menuItem.price) {
          if (nameCount.has(menuItem.name)) {
            nameCount.set(menuItem.name, nameCount.get(menuItem.name) + 1);
          } else {
            nameCount.set(menuItem.name, 1);
          }

          totalPrice += menuItem.price;
        }
      }
    });

    const sortedNameCount = new Map(
      [...nameCount.entries()].sort((a, b) => b[1] - a[1])
    );

    const formattedTotalPrice = totalPrice.toLocaleString("en-US");

    const response = {
      count: Object.fromEntries(sortedNameCount),
      totalPrice: formattedTotalPrice,
    };

    return res.status(200).json({ ok: true, msg: "good", data: response });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ ok: false, msg: err, data: {} });
  }
};
