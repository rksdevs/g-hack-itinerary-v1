**Gemini Itinerary - For Google Gemini AI Hackathon** - Link: https://gemini-itinerary.onrender.com/ 

**Caution** - Still under development fine tuning application, writing test cases, handling regression testing on local, so you might run into issues occasionally. Please bear with me :D

**About Project**

## Inspiration
I want to improvise existing API experiences for end users with the power of Gemini AI. So here I've used Google Maps & Places API, then customized the responses with Gemini AI, to serve it to the end users.

## What it does
With this application, an user can login, select places to visit based on interests like (shopping, religious, nature etc), can select restaurants to have food based on various cuisines. And prepare an itinerary from these selections.

In this application I generate the top places suggestion (limited top 3 places right now) with help of Gemini AI, along with a few details about the places like what can we do and what it sells etc. Then I send the location details from Gemini AI, to Google Maps and Google Places API, to further collect more information, like photos, complete address etc and place a marker on the place.

By the end the user is able to select 2 places to visit and 3 places to have breakfast, lunch and dinner based on interests and cuisines respectively. Then I take Gemini AI's help to create an itinerary to visit these places and restaurants selected by the user. User can save the itinerary to their account and share the public link of the itinerary.

## How I built it
I've used React JS in the client side and Node JS with Express and Mongo DB for server side requirements. I've used Shadcn UI as the frontend UI library, and some other libraries like react-router-dom, redux toolkit, jsonwebtoken, bcrypt etc.

Current Status: The application hosted at Render free tier might need multiple reloads to load initially (free tier constraints), it is not responsive to mobile screen - which I'm yet to do and couldnt do due to time constraints as solo developer.

What is working well:
1. User login/logout with http only cookie
2. Selecting two places to visit -- from the places suggested by Gemini AI based on selected interests
3. Selecting 3 places to have breakfast, lunch, dinner -- from the places suggested by Gemini AI based on selected cuisines
4. Creating directions by adding all these selected places as waypoints in Google Map
5. Creating a unique itinerary for all these places - Generated by Gemini AI

Constraints of this project: 
1. Some fine tuning is yet to be done like: Adding, distance, duration, selection more than 2 places to visit, and selecting dates, or selecting places between various countries - are not done.
2. I've desingned and developed this on my laptop screen - I haven't had the time to work on responsiveness and mobile/tab/extra large screens yet. So please expect some layout issue based on screensize.
3. A few error handling scenarios are yet to be done: Occasionally I run into Google Gemini Prompt erros which are not handled properly, because I can't really test them since they are not that frequent.
4. I haven't yet written the test case code due to time constraints.

## Challenges I ran into
There were several challenge I ran into but below are some prominent ones:
1. Time constraint - I'm the only developer on this project, juggling between, job/family has been hectic
2. Sometimes Gemini AI response are not correct, so I get errors while parsing the responses. This is rare and hence I haven't been able to handle the error properly
3. One major Issue with Google Places API -- when I add the address of restaurants, the Google Places API shows the street address and photos for the restaurants, but not the exact restaurants, but this works just fine for places. I haven't been able to find a reason behind this, I've also raised this in Google Maps channel in the discord. To work around this - The restaurant data shown in the application are purely from Gemini AI's data and not from Google Places API. Hence you might see the static images I've added repeating themselves in the carousels. Apart from the images every other data are from Gemini AI

## Accomplishments that I'm proud of
I'm super excited as I've build my first AI powered working app to improve Google Maps experience.

I'm proud of actually making it work by juggling between multiple APIs offered by Google. This enhances the user's experience by adding Gemini AI's suggestions into the Google places API. 

So what I've achieved is to enchance the existing Google Places API experience, and adding more value to it.
 
My goal is to enchance the existing APIs with the help of Gemini AI, although the goal is a little far, but I'll take one step at a time.

## What I learned
I've learned a lot of things pretty sure I can not list all of them, but few very important are as follows:
1. Integrating Gemini AI to MERN stack application
2. Working with Gemini AI prompts
3. Engineering prompts to serve the responses better - currently I get 1 error in around 20 plus tries
4. Working with multiple APIs offered by Google Cloud console, and clubbing all of them using a single API key to seamlessly integrate multiple APIs
5. Working with Generative AI in general, and improving the user experience

## What's next for Itinerary Builder With Gemini AI
There are a lot of thing I've thought to add to this project, starting with resolving all the constraints a few of them are:
1. Make the app responsive, and mobile screen freindly since the targetted users are Mobile Users
2. Mobile application - I'll work on developing a mobile application once this desktop application is ready
3. Allowing users to select places from different countries
4. Allowing users to select different dates
5. Allowing users to select more places 
6. Generating more no of recommendations by Gemini AI

 **How to Build the Project in Local**
1. Clone the Repo
2. Spin up your Mongo DB
3. Copy the env Samples both from frontend and Root folder and add your keys
4. Install all the dependencies/libraries from Root and from Frontend folders - using "npm intall"
5. Use npm run dev to start the project

**Features & Echancements with their Status**
1. The application is designed as desktop first, so mobile/tab/small-screen design is pending -- Pending
2. Planning to integrate Google Places API for tailoring out images of the suggested locations - for better user experience -- Completed
3. UI enchancements - Redesign of pages, removing white spaces - Completed
4. Planning to make some architechtural changes and move most of the actions to server side to ensure faster client side experience - Pending
5. Other enhancements are mentioned in the above section.
