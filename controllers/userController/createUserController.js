import { createAccountNibss } from "../../services/nibssServices.js";
import User from "../../models/userModel.js";
import Account from "../../models/accountModel.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  const { email, password, phone, bvn } = req.body;
  const bvnData = req.bvnData;
  console.log(bvnData);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newNibssAccount = await createAccountNibss({
      kycType: "bvn",
      kycID: bvnData.bvn,
      dob: bvnData.dob,
    });

    const nibssAccountData = newNibssAccount?.account;

    const newUser = await User.create({
      firstName: bvnData.firstName,
      lastName: bvnData.lastName,
      email,
      bvn,
      dob: bvnData.dob,
      phone,
      password: hashedPassword,
    });

    await Account.create({
      userId: newUser._id,
      accountNumber: nibssAccountData.accountNumber,
      bankCode: nibssAccountData.bankCode,
      accountBalance: nibssAccountData.balance,
    });

    res.status(201).json({
      ok: true,
      message: `Dear ${bvnData.firstName + " " + bvnData.lastName}, your account has been created successfully`,
      data: {
        accountNumber: nibssAccountData.accountNumber,
        balance: nibssAccountData.balance,
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
