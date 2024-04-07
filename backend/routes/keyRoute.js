import express from "express"
import { getGoogleMapKey } from "../controllers/keyController.js";
const router = express.Router();

router.get("/google-map-key", getGoogleMapKey)

export default router