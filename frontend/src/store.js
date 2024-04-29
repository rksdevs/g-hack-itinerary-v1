import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice";
import plannerDetailsReducer from "./slices/plannerSlice"
import itineraryReducer from "./slices/itinerarySlice";

export const store = configureStore ({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authSliceReducer,
        plannerDetails: plannerDetailsReducer,
        itinerary: itineraryReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})