import express from "express";
import { createBvn } from "../controllers/bvnController/createBvn.js";
import { validateCreateBvn } from "../middleware/validateCreateBvn.js";
import { validateCreateNin } from "../middleware/validateCreateNin.js";
import { createNin } from "../controllers/ninController/createNin.js";

const router = express.Router();

router.post("/create-bvn", validateCreateBvn, createBvn);
router.post("/create-nin", validateCreateNin, createNin);

export default router;
