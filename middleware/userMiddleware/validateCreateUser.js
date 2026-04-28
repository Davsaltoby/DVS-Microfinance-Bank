import { validateBvnNibss } from "../../services/nibssIdentity/nibssIdentityBvn.js";
import User from "../../models/userModel.js";

const validateCreateUser = async (req, res, next) => {
  const { email, password, phone, bvn } = req.body;

  if (!email?.trim() || !password?.trim() || !phone?.trim() || !bvn?.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "all fields are required" } });
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "invalid email format" } });
  }

  if (password?.trim().length < 6) {
    return res.status(400).json({
      ok: false,
      error: { message: "password must not be less than 6 characters" },
    });
  }

  if (phone?.trim().length > 11) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "invalid phone number" } });
  }

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    return res.status(409).json({
      ok: false,
      error: { message: `a user with email: ${email}, already exists` },
    });
  }
  let bvnData;
  try {
    bvnData = await validateBvnNibss({ bvn });
  } catch (err) {
    switch (err.message) {
      case "Invalid BVN provided":
        return res
          .status(404)
          .json({ ok: false, error: { message: err.message } });

      case "bvn already linked to an account":
        return res
          .status(409)
          .json({ ok: false, error: { message: err.message } });

      default:
        console.log(err);
        return res
          .status(500)
          .json({ ok: false, error: { message: err.message } });
    }
  }

  req.bvnData = bvnData.data;

  next();
};

export { validateCreateUser };
