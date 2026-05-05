import express from "express";
import transactionStatusController from "../controllers/transactionStatusController.js";
import authentication from "../middleware/auth/authentication.js";

const router = express.Router();
router.get("/:transactionId", authentication, transactionStatusController);

export default router;
