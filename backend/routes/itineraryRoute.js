import express from "express";
const router = express.Router();
import { addItinerary, getAllItinerary, getSpecificItinerary } from "../controllers/itineraryController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.post("/addItinerary", protect, addItinerary);

router.get("/myItineraries", protect, getAllItinerary);

router.get("/:id", getSpecificItinerary);

export default router;