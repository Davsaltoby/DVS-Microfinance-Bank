import { transferNibss } from "../services/nibssServices.js";
import Account from "../models/accountModel.js";
import Transaction from "../models/transactionModel.js";
import { accountBalanceEnquiryNibss } from "../services/nibssServices.js";

const transferController = async (req, res) => {
  try {
    const { to, amount } = req.body;
    const userId = req.user.userId;

    const userAccount = req.userAccount;

    const userAccountNumber = userAccount?.accountNumber;

    const transferRes = await transferNibss({
      from: userAccountNumber,
      to,
      amount,
    });

    const userAccountBalanceEnquiry =
      await accountBalanceEnquiryNibss(userAccountNumber);

    await userAccount
      .set({
        accountBalance: userAccountBalanceEnquiry.balance,
      })
      .save();

    const receiverAccount = await Account.findOne({ accountNumber: to });
    if (receiverAccount) {
      const receiverAccountBalanceEnquiry =
        await accountBalanceEnquiryNibss(to);

      await receiverAccount
        .set({
          accountBalance: receiverAccountBalanceEnquiry.balance,
        })
        .save();
    }

    const receiverId = receiverAccount?.userId;

    const transactionRes = await Transaction.create({
      senderId: userId,
      receiverId: receiverId ? receiverId : null,
      transactionId: transferRes?.reference,
      amount: transferRes?.amount,
      from: transferRes?.senderAccount,
      to: transferRes?.receiverAccount,
      status: transferRes?.status,
    });

    res.status(200).json({
      ok: true,
      message: "transfer successful",
      data: transactionRes,
    });
  } catch (err) {
    console.error(`transfer error: ${err}`);
    res
      .status(500)
      .json({ ok: false, error: { message: "cannot complete transfer" } });
  }
};

export default transferController;
