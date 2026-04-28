import express from "express";
const router = express.Router();
import { createUser } from "../controllers/userController/createUserController.js";
import { validateCreateUser } from "../middleware/userMiddleware/validateCreateUser.js";

router.post("/register", validateCreateUser, createUser);

export default router;
