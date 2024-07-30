import express from "express";
import Shop from "../models/shop.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/index.js";
import { checkPermissions } from "../utils/index.js";
import { auth } from "./verifyToken.js";
const router = express.Router();

router.post(
  "/",
  [authenticateUser, authorizePermissions("retailer")],
  async (req, res) => {
    const { id: shop_id } = req.params;
    const { name, type, floor, number } = req.body;
    try {
      // const existingShop = await Shop.findOne({ id: shop_id });
      // if (existingShop) {
      //   return res.status(400).json({
      //     message: `Shop with this id already exists`,
      //   });
      // }

      const shop = await Shop.create({
        name,
        type,
        floor,
        number,
        ownerId: req.user.user_id,
      });
      res.status(StatusCodes.OK).json({ shop });
    } catch (err) {
      console.error("Error saving shop:", err);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);

router.get(
  "/",
  // auth,
  authenticateUser,
  authorizePermissions("admin"),
  async (req, res) => {
    const shops = await Shop.find({});
    res.status(StatusCodes.OK).json({ shops, count: shops.length });
  }
);

router.get("/showAllMyShops", authenticateUser ,async (req, res) => {
  const shops = await Shop.find({ ownerId: req.user.user_id });
  res.status(StatusCodes.OK).json({ shops, count: shops.length });
});

router.get("/:id", authenticateUser, async (req, res) => {
  const { id: shop_id } = req.params;
  const shop = await Shop.findOne({ _id: shop_id });
  if (!shop) {
    throw new CustomAPIError.NotFoundError(`No shop with the id: ${shop_id}`);
  }
  console.log("Request User:", req.user);
  console.log("Shop OwnerId:", shop.ownerId);
  checkPermissions(req.user, shop.ownerId);
  res.status(StatusCodes.OK).json({ shop, count: shop.length });
});

router.patch("/:id", authenticateUser, async (req, res) => {
  const { id: shop_id } = req.params;
  const { name, type, floor, number } = req.body;
  const shop = await Shop.findOne({ _id: shop_id });
  if (!shop) {
    throw new CustomAPIError.NotFoundError(`No shop with the id: ${shop_id}`);
  }
  shop.name = name;
  shop.type = type;
  shop.floor = floor;
  shop.number = number;
  await shop.save();
  res.status(StatusCodes.OK).json({ shop, count: shop.length });
});

export default router;
