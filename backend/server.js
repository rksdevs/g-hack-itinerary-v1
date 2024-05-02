import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import { connect } from "./config/db.js";
import { basicErrorHandler, notFound } from "./middlewares/errorHandlerMiddleware.js";
import loginRoute from "./routes/authRoute.js"
import mapRoute from "./routes/mapStaticRoute.js"
import itineraryRoute from "./routes/itineraryRoute.js"
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 8800
connect();

const corsOptions = {
  origin: true, // Change this to the origin(s) you want to allow.
  credentials: true, // Indicates that cookies and credentials should be included.
};

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(corsOptions))

app.use("/api/users", loginRoute);
app.use("/api/map", mapRoute);
app.use("/api/itinerary", itineraryRoute)

const __dirname = path.resolve(); //set __dirname to current directory;
if(process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    //any routes which is not listed in the api will be redirect to index page
    app.get("*", (req,res)=>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
    app.get("/", (req, res)=>{
        res.send("API is running...")
    })
}


app.use(notFound);
app.use(basicErrorHandler);

app.listen(PORT, (req, res)=>{
    console.log("Running on Port: ", PORT)
})