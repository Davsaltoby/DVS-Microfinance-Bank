import express from "express";
import { getAllAccountsController } from "../controllers/adminController/getAllAccountsController.js";

const router = express.Router();
router.get("/fetch-user-accounts", getAllAccountsController);

export default router;
