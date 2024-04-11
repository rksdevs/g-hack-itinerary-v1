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
        addPlaceTwoOptions: (state, action) => {
            state.placeTwoOptions = action.payload;
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
            plannerDetails.placeTwoOptions = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addPlaceOneTiming: (state, action) => {
            state.placeOneDetails.timings = action.payload;
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
            plannerDetails.placeOneDetails.timings = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addPlaceTwoTiming: (state, action) => {
            state.placeTwoDetails.timings = action.payload;
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
            plannerDetails.placeTwoDetails.timings = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addBreakfastOptions: (state, action) => {
            state.foodPlanOptions.breakfastOptions = action.payload;
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
            plannerDetails.foodPlanOptions.breakfastOptions = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addBreakfast: (state, action) => {
            state.foodPlan.breakfast = action.payload;
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
            plannerDetails.foodPlan.breakfast = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addLunchOptions: (state, action) => {
            state.foodPlanOptions.lunchOptions = action.payload;
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
            plannerDetails.foodPlanOptions.lunchOptions = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addLunch: (state, action) => {
            state.foodPlan.lunch = action.payload;
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
            plannerDetails.foodPlan.lunch = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addBrunchOptions: (state, action) => {
            state.foodPlanOptions.brunchOptions = action.payload;
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
            plannerDetails.foodPlanOptions.brunchOptions = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addBrunch: (state, action) => {
            state.foodPlan.brunch = action.payload;
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
            plannerDetails.foodPlan.brunch = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addDinnerOptions: (state, action) => {
            state.foodPlanOptions.dinnerOptions = action.payload;
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
            plannerDetails.foodPlanOptions.dinnerOptions = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        addDinner: (state, action) => {
            state.foodPlan.dinner = action.payload;
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
            plannerDetails.foodPlan.dinner = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        clearPlanner: (state) => {
            localStorage.removeItem("plannerDetails")
            return initialState;
        }
    }
})

export const {addPlaceOne, addPlaceTwo, addPlaceOneOptions, addPlaceTwoOptions, clearPlanner, addPlaceOneTiming, addPlaceTwoTiming, addBreakfast, addBreakfastOptions, addLunch, addLunchOptions, addBrunch, addBrunchOptions, addDinner, addDinnerOptions} = plannerDetailsSlice.actions;

export default plannerDetailsSlice.reducer;