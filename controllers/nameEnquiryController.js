import { nameEnquiryNibss } from "../services/nibssServices.js";

const nameEnquiryController = async (req, res) => {
  const accountNumber = req.params.accountNumber;

  if (!accountNumber?.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "account number required" } });
  }

  try {
    const userDetails = await nameEnquiryNibss({ accountNumber });

    res.status(200).json({
      ok: true,
      message: "account name enquiry successful",
      data: userDetails,
    });
  } catch (error) {
    console.log(error);
    if (error.message === "account not found") {
      return res
        .status(404)
        .json({ ok: false, error: { message: error.message } });
    }

    return res.status(500).json({
      ok: false,
      error: { message: "could not fetch account details" },
    });
  }
};

export default nameEnquiryController;
