import { getAllAccountsNibss } from "../../services/nibssServices.js";
const getAllAccountsController = async (req, res) => {
  try {
    const accounts = await getAllAccountsNibss();
    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to fetch accounts",
    });
  }
};

export { getAllAccountsController };
