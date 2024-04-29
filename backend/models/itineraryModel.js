import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    placeOneDetails: {
        type: Object,
        required: true,
  },
    placeToStayDetails: {
        type: Object,
        required: true,
  },
    itineraryReadyToBuild: {
        type: Boolean,
      required: true,
  },
    placeTwoDetails: {
        type: Object,
        required: true,
  },
    foodPlan: {
      breakfast: Object,
      lunch: Object,
      brunch: Object,
      dinner: Object,
        },
    destinationDetails: {
      origin: String,
      destination: String,
      travelDate: String,
      modeOfTravel: String,
      travelDuration: String,
      travelDistance: String,
      arrivalDate: String,
      },
      itineraryResponse: {
          type: String,
          required: true,
    }
}, { timestamps: true });

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary