**Itinerary With Gemini AI - For Google Gemini Hackathon**

**About Project**
This is a web application built using MERN tech stack, to create itinerary for a place that you're going to visit. This application uses Gemini AI to suggest all the options you have to choose which places you would want to visit and which places you would want to dine at.
_Technical Specifications:_
1. At the heart of this project is Javascript, I've coupled React JS in the frontend along with Node Js/Express Js in the backend and used Mongo DB as the database to build this project.
2. For UI I've used Shad Cn, which is based on Radix UI and Tailwind CSS to make sure the application is intuitive and visually appealing.
3. For routing, I've used React Router Dom library
4. For Authentication and security I've used JWT & bcrypt
5. I've used several other packages like Nodemon, Concurrently in the backend to help with faster development experience
6. I've used other libraries like React Redux Toolkit for state management, react-google-maps/api to power my apps Google maps features 
7. From API standpoints, I've used Google Map API, Google Gemini API to put my ideas into reality
_User Experience & Features of the application:_
1. You can register & login into the application
2. After login you'll land on the setup-destination page
3. Setup destination Flow: Here user needs to add their origin location, destination, mode of travel, and date of travel
4. Once this is setup, User will get the travel distance, approximate travel time based on their mode of travel
5. Then user moves to the Planner page, where user can choose up to 2 places that they can visit
6. User gets to choose locations best on interests like religious, natural attractions (forests/beaches/mountains), shopping malls, or Miscallaneous
7. Upon selection, Top 3 places are suggested by Gemini and user gets to choose one of them as 1st place to visit, similarly they can add another 2nd place to visit and set up the time for the visit for both of the places
8. Next they can setup or skip the food plans like Breakfast, Lunch and Dinner
9. User can choose the cuisine they want to have, based on the cuisines Gemini will suggest top 3 Restaurants to select from
10. After selecting the restaurants, user moves to itinerary page, where all the selected details are shown and Gemini builds an itinerary when user confirms.

 **How to Build the Project in Local**
1. Clone the Repo
2. Spin up your Mongo DB
3. Copy the env Samples both from frontend and Root folder and add your keys
4. Install all the dependencies/libraries from Root and from Frontend folders - using "npm intall"
5. Use npm run dev to start the project

**Features & Echancements with their Status**
1. The application is designed as desktop first, so mobile/tab/small-screen design is pending -- Pending
2. Planning to integrate Google Places API for tailoring out images of the suggested locations - for better user experience -- Pending
3. UI enchancements - Redesign of pages, removing white spaces - Pending
4. Planning to make some architechtural changes and move most of the actions to server side to ensure faster client side experience - Pending
