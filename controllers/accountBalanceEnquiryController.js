import { accountBalanceEnquiryNibss } from "../services/nibssServices.js";

const accountBalanceEnquiryController = async (req, res) => {
  const accountNumber = req.params.accountNumber;

  if (!accountNumber) {
    return res.status(400).json({
      ok: false,
      error: { message: "account number is required" },
    });
  }

  try {
    const balanceEnquiry = await accountBalanceEnquiryNibss(accountNumber);

    res.status(200).json({
      ok: true,
      message: "account balance enquiry successful",
      data: balanceEnquiry,
    });
  } catch (err) {
    console.error(`account balance enquiry error: ${err}`);
    res.status(500).json({
      ok: false,
      error: { message: "cannot complete account balance enquiry" },
    });
  }
};

export default accountBalanceEnquiryController;
