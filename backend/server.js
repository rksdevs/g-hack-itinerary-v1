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


app.get("/", (req, res)=> {
    res.send("Server is up and running")
})

app.use("/api/users", loginRoute);
app.use("/api/map", mapRoute);
app.use("/api/itinerary", itineraryRoute)


app.use(notFound);
app.use(basicErrorHandler);

app.listen(PORT, (req, res)=>{
    console.log("Running on Port: ", PORT)
})