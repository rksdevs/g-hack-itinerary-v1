import express from "express";
const router = express.Router();
import { login, register } from "../controllers/authController.js";

router.post("/", login);
router.post("/register", register);

export default router;
