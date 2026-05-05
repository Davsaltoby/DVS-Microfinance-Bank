import express from "express";
import nameEnquiryController from "../controllers/nameEnquiryController.js";

const router = express.Router();

router.get("/name-enquiry/:accountNumber", nameEnquiryController);

export default router;
