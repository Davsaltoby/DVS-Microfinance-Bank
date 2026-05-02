import express from "express";
const router = express.Router();
import { createUser } from "../controllers/userController/createUserController.js";
import { validateCreateUser } from "../middleware/userMiddleware/userAuth/validateCreateUser.js";
import { validateUserLogin } from "../middleware/userMiddleware/userAuth/userLoginAuth.js";
import userLogin from "../controllers/authController/userLogin.js";

router.post("/register", validateCreateUser, createUser);
router.post("/login", validateUserLogin, userLogin);

export default router;
