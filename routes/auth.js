import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import {createTokenUser,attachCookiesToResponse,checkPermissions, createJwt} from "../utils/index.js";
const router = express.Router();
import CustomAPIError from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

router.post("/register", async (req, res) => {
  const { username, password, email, phone_number } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomAPIError.BadRequestError("Email Already Exists");
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;

  const role = isFirstAccount ? "admin" : "retailer";

  const user = await User.create({ username, email, password, role,phone_number });

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
});
//////////

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomAPIError.BadRequestError(
      "Please provide email and password"
    );
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomAPIError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  const token = createJwt({payload:tokenUser})
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser ,token});
});

router.post("/logout", (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User Logged Out!" });
});
export default router;
