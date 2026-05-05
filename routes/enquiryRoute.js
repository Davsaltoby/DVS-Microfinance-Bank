import express from "express";
import nameEnquiryController from "../controllers/nameEnquiryController.js";
import authentication from "../middleware/auth/authentication.js";
import accountBalanceEnquiryController from "../controllers/accountBalanceEnquiryController.js";

const router = express.Router();

router.get("/name-enquiry/:accountNumber", nameEnquiryController);
router.get(
  "/balance/:accountNumber",
  authentication,
  accountBalanceEnquiryController,
);

export default router;
