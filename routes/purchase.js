import express from "express";
import Purchase from "../models/purchase.js";
import Shop from "../models/shop.js";
import { StatusCodes } from "http-status-codes";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";
import CustomAPIError from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";

const router = express.Router();

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { shop_id, items } = req.body;

    console.log(items);
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Items must be an array with an atleast one item" });
    }
    let total_amount = 0;

    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Each item must have a name, price, and quantity",
        });
      }
      if (item.price < 0 || item.quantity < 1) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Price must be positive and quantity must atleast 1",
        });
      }
      total_amount += item.quantity * item.price;
    }
    console.log(total_amount);
    // Create the purchase
    const purchase = await Purchase.create({
      shop_id,
      items,
      total_amount,
      owner_id: req.user.user_id,
    });

    res.status(StatusCodes.OK).json({ purchase });
  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

router.get("/",  authenticateUser,async (req, res) => {
  try {
    const purchase = await Purchase.find({})
      .populate({
        path: "shop_id",
        select: "name",
      })
      .populate({
        path: "owner_id",
        select: "username",
      });

    res.status(StatusCodes.OK).json({ purchase });
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

router.get("/by-date", authenticateUser, async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: "Please provide start and end date" });
  }

  try {
    const start = new Date(start_date);
    const end = new Date(end_date);

    const purchase = await Purchase.find({
      created_at: {
        $gte: start,
        $lte: end,
      },
    });

    res.status(200).json(purchase);
  } catch (error) {
    console.error("Error fetching purchase by date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  const { id: purchaseId } = req.params;
  const purchase = await Purchase.findOne({ _id: purchaseId });
  if (!purchase) {
    throw new CustomAPIError.NotFoundError(
      `No sale found for this id ${purchaseId}`
    );
  }
  res.status(StatusCodes.OK).json({ purchase });
});

router.patch("/:id", authenticateUser, async (req, res) => {
  const { id: purchaseId } = req.params;
  const { items } = req.body;
  const purchase = await Purchase.findOne({ _id: purchaseId });
  if (!purchase) {
    throw new CustomAPIError.NotFoundError(
      `No sale found for this id ${saleId}`
    );
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Items must be an array with at least one item" });
  }
  let total_amount = 0;

  for (const item of items) {
    if (!item.name || !item.price || !item.quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Each item must have a name, price, and quantity",
      });
    }
    if (item.price < 0 || item.quantity < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Price must be positive and quantity must be at least 1",
      });
    }
    total_amount += item.quantity * item.price;
  }

  checkPermissions(req.user, purchase.owner_id);

  purchase.items = items;
  purchase.total_amount = total_amount;
  await purchase.save();
  res.status(StatusCodes.OK).json({ purchase });
});

router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id: purchaseId } = req.params;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `No purchase found for this id ${purchaseId}` });
    }

    checkPermissions(req.user, purchase.owner_id);

    await Purchase.deleteOne({ _id: purchaseId });

    res
      .status(StatusCodes.OK)
      .json({ message: "Purchase deleted successfully" });
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});
export default router;
