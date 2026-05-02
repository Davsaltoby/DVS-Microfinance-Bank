import bcrypt from "bcrypt";
import User from "../../../models/userModel.js";

const validateUserLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "all fields are required" } });
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res
      .status(404)
      .json({ ok: false, eerror: { message: "invalid credentials" } });
  }

  const matchedPassword = await bcrypt.compare(password, existingUser.password);

  if (!matchedPassword) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "invalid credentials" } });
  }

  req.user = existingUser;

  next();
};

export { validateUserLogin };
