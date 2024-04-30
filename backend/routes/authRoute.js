import express from "express";
const router = express.Router();
import { login, logout, register } from "../controllers/authController.js";

router.post("/auth", login);
router.post("/register", register);
router.post("/logout", logout)

export default router;
