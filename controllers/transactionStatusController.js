import { transactionStatusEnquiryNibss } from "../services/nibssServices.js";

const transactionStatusController = async (req, res) => {
  const transactionId = req.params.transactionId;
  if (!transactionId) {
    return res.status(400).json({
      ok: false,
      error: { message: "transaction id is required" },
    });
  }
  const validTransactionId = transactionId.trim();

  try {
    const transactionStatus =
      await transactionStatusEnquiryNibss(validTransactionId);
    res.status(200).json({
      ok: true,
      message: "transaction status enquiry successful",
      data: transactionStatus,
    });
  } catch (err) {
    console.error(`transaction status enquiry error: ${err}`);
    res.status(500).json({
      ok: false,
      error: { message: "cannot complete transaction status enquiry" },
    });
  }
};

export default transactionStatusController;
