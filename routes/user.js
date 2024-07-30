import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";
import { StatusCodes } from "http-status-codes";
import {createTokenUser,attachCookiesToResponse,checkPermissions} from "../utils/index.js";
import {auth} from "./verifyToken.js";

import Shop from "../models/shop.js";
import Sales from "../models/sale.js";
import Purchase from "../models/purchase.js";
const router = express.Router();

router.get(
  "/",
  // auth,
  // authenticateUser,
  // authorizePermissions("admin"),
  async (req, res) => {
    const users = await User.find({ role: "retailer" }).select("-password"); // .select('-password) will remove password from the response
    res.status(StatusCodes.OK).json({ users });
  }
);

router.get("/showMe", authenticateUser, async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

router.patch("/updateUser", authenticateUser, async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) {
    throw new CustomAPIError.BadRequestError("Please provide all values");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.user_id },
    { email, username },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
});

router.patch("/updateUserPassword", authenticateUser, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    console.log("check");
    throw new CustomAPIError.BadRequestError("Please provide both Values");
  }
  const user = await User.findOne({ _id: req.user.user_id });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError("Invalid Password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password changed successfully!" });
});

router.get("/:id", authenticateUser, async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomAPIError.NotFoundError(
      `No user with id : ${req.params.id}`
    );
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
});
export default router;
