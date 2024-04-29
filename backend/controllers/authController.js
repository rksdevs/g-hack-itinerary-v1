import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (await user.matchPasswords(password)) {
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        email: user.email,
        name: user.username,
        isAdmin: user.isAdmin,
      });
    } else {
        res.status(401);
        throw new Error("Incorrect password!");
    }
  } else {
    res.status(401);
    throw new Error("No user found, please register!");
  }
});

const register = asyncHandler(async (req, res) => {
  const { username, email, password, country } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists, please login");
  }

  const user = await User.create({
    username,
    email,
    password,
    country,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export { login, register };
