import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    itineraryDetails: localStorage.getItem("itinerary") ? JSON.parse(localStorage.getItem("itinerary")) : null
}

export const itinerarySlice = createSlice({
    name: "itinerary",
    initialState,
    reducers: {
        setItinerary: (state, action) => {
            state.itineraryDetails = action.payload;
            localStorage.setItem("itinerary", JSON.stringify(action.payload));
        },
        clearItinerary: (state) => {
            state.itineraryDetails = null;
            localStorage.getItem("itinerary") && localStorage.removeItem("itinerary")
        }
    }
})

export const { setItinerary, clearItinerary } = itinerarySlice.actions;

export default itinerarySlice.reducer;