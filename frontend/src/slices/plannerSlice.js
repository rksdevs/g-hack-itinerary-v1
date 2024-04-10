import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("plannerDetails") ? JSON.parse(localStorage.getItem("plannerDetails"))  : {
    placeOneDetails: null,
    placeTwoDetails: null,
    foodPlan: {
        breakfast: null,
        lunch: null,
        brunch: null,
        dinner: null,
    },
    placeOneOptions: [],
    placeTwoOptions: [],
    foodPlanOptions: {
        breakfastOptions: [],
        lunchOptions: [],
        brunchOptions: [],
        dinnerOptions: [],
    }
}

const plannerDetailsSlice = createSlice({
    name: "plannerDetails",
    initialState,
    reducers: {
        addPlaceOne: (state, action) => {
            state.placeOneDetails = action.payload;
            const plannerDetails = localStorage.getItem("plannerDetails") ? JSON.parse(localStorage.getItem("plannerDetails")) : {
                placeOneDetails: null,
                placeTwoDetails: null,
                foodPlan: {
                    breakfast: null,
                    lunch: null,
                    brunch: null,
                    dinner: null,
                },
                placeOneOptions: [],
                placeTwoOptions: [],
                foodPlanOptions: {
                    breakfastOptions: [],
                    lunchOptions: [],
                    brunchOptions: [],
                    dinnerOptions: [],
                }
            };
            plannerDetails.placeOneDetails = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addPlaceTwo: (state, action) => {
            state.placeTwoDetails = action.payload;
            const plannerDetails = localStorage.getItem("plannerDetails") ? JSON.parse(localStorage.getItem("plannerDetails")) : {
                placeOneDetails: null,
                placeTwoDetails: null,
                foodPlan: {
                    breakfast: null,
                    lunch: null,
                    brunch: null,
                    dinner: null,
                },
                placeOneOptions: [],
                placeTwoOptions: [],
                foodPlanOptions: {
                    breakfastOptions: [],
                    lunchOptions: [],
                    brunchOptions: [],
                    dinnerOptions: [],
                }
            };
            plannerDetails.placeTwoDetails = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addPlaceOneOptions: (state, action) => {
            state.placeOneOptions = action.payload;
            const plannerDetails = localStorage.getItem("plannerDetails") ? JSON.parse(localStorage.getItem("plannerDetails")) : {
                placeOneDetails: null,
                placeTwoDetails: null,
                foodPlan: {
                    breakfast: null,
                    lunch: null,
                    brunch: null,
                    dinner: null,
                },
                placeOneOptions: [],
                placeTwoOptions: [],
                foodPlanOptions: {
                    breakfastOptions: [],
                    lunchOptions: [],
                    brunchOptions: [],
                    dinnerOptions: [],
                }
            };
            plannerDetails.placeOneOptions = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
    }
})

export const {addPlaceOne, addPlaceTwo, addPlaceOneOptions} = plannerDetailsSlice.actions;

export default plannerDetailsSlice.reducer;