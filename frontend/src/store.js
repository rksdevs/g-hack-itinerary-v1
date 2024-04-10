import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import { usersApiSlice } from "./slices/userApiSlice";
import authSliceReducer from "./slices/authSlice";
import plannerDetailsReducer from "./slices/plannerSlice"

export const store = configureStore ({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authSliceReducer,
        plannerDetails: plannerDetailsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})