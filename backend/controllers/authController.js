import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const login = asyncHandler(async (req, res)=> {
    res.send("You're in login route")
})

const register = asyncHandler(async (req, res) => {
    const {username, email, password, country} = req.body;

    const userExist = await User.findOne({email});

    if(userExist) {
        res.status(400);
        throw new Error("User already exists, please login");  
    }

    const user = await User.create({
        username,
        email,
        password,
        country
    })

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400);
        throw new Error("Invalid user data")
    }
})

export {login, register}