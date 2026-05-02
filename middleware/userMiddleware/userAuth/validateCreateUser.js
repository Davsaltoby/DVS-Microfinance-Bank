import { validateBvnNibss } from "../../../services/nibssIdentity/nibssIdentityBvn.js";
import { validateNinNibss } from "../../../services/nibssIdentity/nibssIdentityNin.js";
import User from "../../../models/userModel.js";

const validateCreateUser = async (req, res, next) => {
  const { email, password, phone, kycType, kycID } = req.body;

  if (
    !email?.trim() ||
    !password?.trim() ||
    !phone?.trim() ||
    !kycID?.trim() ||
    !kycType
  ) {
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

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      ok: false,
      error: { message: `a user with email: ${email}, already exists` },
    });
  }
  let bvnData;
  let ninData;
  if (kycType?.trim() === "bvn") {
    try {
      bvnData = await validateBvnNibss({ bvn: kycID });
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
  } else if (kycType?.trim() === "nin") {
    try {
      ninData = await validateNinNibss({ nin: kycID });
    } catch (err) {
      switch (err.message) {
        case "Invalid NIN provided":
          return res
            .status(404)
            .json({ ok: false, error: { message: err.message } });

        case "nin already linked to an account":
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
  } else {
    return res.status(400).json({
      ok: false,
      error: { message: "invalid kyc type, must be either bvn or nin" },
    });
  }

  req.bvnData = bvnData?.data;
  req.ninData = ninData?.response;

  next();
};

export { validateCreateUser };
