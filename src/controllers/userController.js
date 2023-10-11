import User from "../models/User.js";

export const register = async (req, res) => {
  const { id, password } = req.body;
  try {
    console.log({ id, password });
    await User.create({
      id,
      password: Number(password),
    });
    return res.json({ ok: true, msg: "good" });
  } catch (err) {
    return res.json({ ok: false, msg: `error: ${err}` });
  }
};

export const login = async (req, res) => {
  const { id, password } = req.body;
  const user = await User.findOne({ id });
  if (!user) {
    return res.status(400).json({ ok: false, msg: "The id does not exits." });
  }
  const ok = String(user.password) === String(password);
  if (!ok) {
    return res.status(400).json({ ok: false, msg: "Wrong Password" });
  }

  return res.status(200).json({ ok: true, msg: "good" });
};

export const getVerifiedUser = async (id, password) => {
  const user = await User.findOne({ id });
  if (!user) {
    return null;
  }

  const ok = String(user.password) === String(password);
  if (!ok) {
    return null;
  }

  return user;
};
