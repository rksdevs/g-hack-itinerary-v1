import express from "express"
import { getGoogleMapStaticUrl } from "../controllers/mapStaticUrlController.js";
import {protect} from "../middlewares/authMiddleware.js"
const router = express.Router();

router.get("/google-map-static", protect, getGoogleMapStaticUrl)

export default router