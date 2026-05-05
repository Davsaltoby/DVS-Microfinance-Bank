import { validateBvnNibss } from "../services/nibssIdentity/nibssIdentityBvn.js";
import { validateNinNibss } from "../services/nibssIdentity/nibssIdentityNin.js";
import { nameEnquiryNibss } from "../services/nibssServices.js";
import User from "../models/userModel.js";
import { accountBalanceEnquiryNibss } from "../services/nibssServices.js";
import Account from "../models/accountModel.js";

const transferValidation = async (req, res, next) => {
  const { userEmail, userId } = req.user;
  const { to, amount } = req.body;

  if (!to?.trim() || !amount?.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "all fields are required" } });
  }

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return res
      .status(404)
      .json({ ok: false, error: { message: "user not found" } });
  }

  const userAccount = await Account.findOne({ userId });
  const userAccountBalance = userAccount?.accountBalance;

  const userBvn = user?.bvn;
  const userNin = user?.nin;

  let bvnNibssRes;
  let ninNibssRes;
  let nameEnquiryRes;

  try {
    if (userBvn) {
      bvnNibssRes = await validateBvnNibss({ bvn: userBvn });
    } else if (userNin) {
      ninNibssRes = await validateNinNibss({ nin: userNin });
    } else {
      return res
        .status(400)
        .json({ ok: false, error: { message: "bvn or nin not found" } });
    }
  } catch (err) {
    console.error(`identity error: ${err}`);

    return res
      .status(500)
      .json({ ok: false, error: { message: "an error occured" } });
  }

  try {
    nameEnquiryRes = await nameEnquiryNibss({ accountNumber: to });
  } catch (error) {
    console.error(`name enquiry error: ${error}`);
    if (error.message === "account not found") {
      return res
        .status(404)
        .json({ ok: false, error: { message: error.message } });
    }

    return res
      .status(500)
      .json({ ok: false, error: { message: "an error occured" } });
  }

  if (Number(amount) > userAccountBalance) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "insufficient funds" } });
  }

  req.userAccount = userAccount;

  next();
};

export default transferValidation;
