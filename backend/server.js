import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import { connect } from "./config/db.js";
import { basicErrorHandler, notFound } from "./middlewares/errorHandlerMiddleware.js";
import loginRoute from "./routes/loginRoute.js"

const app = express();
const PORT = process.env.PORT || 8800
connect();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/", (req, res)=> {
    res.send("Server is up and running")
})

app.use("/api/auth", loginRoute)


app.use(notFound);
app.use(basicErrorHandler);

app.listen(PORT, (req, res)=>{
    console.log("Running on Port: ", PORT)
})