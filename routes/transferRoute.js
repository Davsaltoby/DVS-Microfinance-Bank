import express from "express";
import authentication from "../middleware/auth/authentication.js";
import transferValidation from "../middleware/transferValidation.js";
import transferController from "../controllers/transferController.js";

const router = express.Router();

router.post("/", authentication, transferValidation, transferController);

export default router;
