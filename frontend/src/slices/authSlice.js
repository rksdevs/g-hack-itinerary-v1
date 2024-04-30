import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo : localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.getItem('userInfo') && localStorage.removeItem("userInfo");
            localStorage.getItem('itinerary') && localStorage.removeItem('itinerary');
            localStorage.getItem('plannerDetails') && localStorage.removeItem('plannerDetails');
        }
    }
})

export const {setCredentials, logout} = authSlice.actions;

export default authSlice.reducer;