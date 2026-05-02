import { createAccountNibss } from "../../services/nibssServices.js";
import { validateNinNibss } from "../../services/nibssIdentity/nibssIdentityNin.js";
import User from "../../models/userModel.js";
import Account from "../../models/accountModel.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  const { email, password, phone, kycType } = req.body;
  const personalData = kycType === "bvn" ? req.bvnData : req.ninData;
  const kycID = kycType === "bvn" ? personalData?.bvn : personalData?.nin;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newNibssAccount = await createAccountNibss({
      kycType,
      kycID,
      dob: personalData?.dob,
    });

    const nibssAccountData = newNibssAccount?.account;

    const newUser = await User.create({
      firstName: personalData?.firstName,
      lastName: personalData?.lastName,
      email,
      bvn: kycType === "bvn" ? personalData?.bvn : null,
      nin: kycType === "nin" ? personalData?.nin : null,
      dob: personalData?.dob,
      phone,
      password: hashedPassword,
    });

    await Account.create({
      userId: newUser._id,
      accountNumber: nibssAccountData?.accountNumber,
      bankCode: nibssAccountData?.bankCode,
      accountBalance: nibssAccountData?.balance,
    });

    res.status(201).json({
      ok: true,
      message: `Dear ${personalData?.firstName} ${personalData?.lastName}, your account has been created successfully`,
      data: {
        accountNumber: nibssAccountData?.accountNumber,
        balance: nibssAccountData?.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ ok: false, error: { message: "something went wrong" } });
  }
};
export { createUser };
