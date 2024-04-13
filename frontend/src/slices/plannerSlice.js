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
    },
    destinationDetails: {
        origin: null,
        destination: null,
        travelDate: null,
        modeOfTravel: null,
        travelDuration: null,
        travelDistance: null,
    }
}

const plannerDetailsSlice = createSlice({
    name: "plannerDetails",
    initialState,
    reducers: {
        setupDestination: (state, action) => {
            state.destinationDetails = action.payload;
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,
                    travelDistance: null,
                }
            };
            plannerDetails.destinationDetails = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.dinner = action.payload;
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails))
        },
        skipBreakfast: (state)=> {
            state.foodPlan.breakfast = {skip: true};
            state.foodPlanOptions.breakfastOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.breakfast = {skip: true};
            plannerDetails.foodPlanOptions.breakfastOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        chooseBreakfast: (state)=> {
            state.foodPlan.breakfast = null;
            state.foodPlanOptions.breakfastOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.breakfast = null;
            plannerDetails.foodPlanOptions.breakfastOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        skipLunch: (state)=> {
            state.foodPlan.lunch = {skip: true};
            state.foodPlanOptions.lunchOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.lunch = {skip: true};
            plannerDetails.foodPlanOptions.lunchOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        chooseLunch: (state)=> {
            state.foodPlan.lunch = null;
            state.foodPlanOptions.lunchOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.lunch = null;
            plannerDetails.foodPlanOptions.lunchOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        skipBrunch: (state)=> {
            state.foodPlan.brunch = {skip: true};
            state.foodPlanOptions.brunchOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.brunch = {skip: true};
            plannerDetails.foodPlanOptions.brunchOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        chooseBrunch: (state)=> {
            state.foodPlan.brunch = null;
            state.foodPlanOptions.brunchOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.brunch = null;
            plannerDetails.foodPlanOptions.brunchOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        skipDinner: (state)=> {
            state.foodPlan.dinner = {skip: true};
            state.foodPlanOptions.dinnerOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.dinner = {skip: true};
            plannerDetails.foodPlanOptions.dinnerOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        chooseDinner: (state)=> {
            state.foodPlan.dinner = null;
            state.foodPlanOptions.dinnerOptions = [];
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
                },
                destinationDetails: {
                    origin: null,
                    destination: null,
                    travelDate: null,
                    modeOfTravel: null,
                    travelDuration: null,travelDistance: null,
                }
            };
            plannerDetails.foodPlan.dinner = null;
            plannerDetails.foodPlanOptions.dinnerOptions = [];
            localStorage.setItem("plannerDetails", JSON.stringify(plannerDetails)) 
        },
        clearPlanner: (state) => {
            localStorage.removeItem("plannerDetails")
            return initialState;
        }
    }
})

export const {setupDestination,addPlaceOne, addPlaceTwo, addPlaceOneOptions, addPlaceTwoOptions, clearPlanner, addPlaceOneTiming, addPlaceTwoTiming, addBreakfast, addBreakfastOptions, addLunch, addLunchOptions, addBrunch, addBrunchOptions, addDinner, addDinnerOptions, skipBreakfast, chooseBreakfast, skipBrunch, skipLunch, skipDinner, chooseBrunch, chooseDinner, chooseLunch} = plannerDetailsSlice.actions;

export default plannerDetailsSlice.reducer;