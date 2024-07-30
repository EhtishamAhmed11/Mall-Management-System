import express from "express";
import Sales from "../models/sale.js";
import Shop from "../models/shop.js";
import { StatusCodes } from "http-status-codes";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";
import CustomAPIError from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";

const router = express.Router();

// Create a sale
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { shop_id, items } = req.body;

    // Check if the shop exists using findById
    // const isValidShop = await Shop.findById(shop_id);
    // console.log(isValidShop)
    // if (!isValidShop) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ message: "Shop not found" });
    // }
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
    // Create the sale
    const sale = await Sales.create({
      shop_id,
      items,
      total_amount,
      owner_id: req.user.user_id,
    });

    res.status(StatusCodes.OK).json({ sale });
  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});
//get all sales
router.get("/",  authenticateUser,async (req, res) => {
  try {
    const sales = await Sales.find({})
      .populate({
        path: "shop_id",
        select: "name",
      })
      .populate({
        path: "owner_id",
        select: "username",
      });

    res.status(StatusCodes.OK).json({ sales });
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});
// // Get sales by date range
router.get("/by-date", authenticateUser, async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: "Please provide start and end date" });
  }

  try {
    const start = new Date(start_date);
    const end = new Date(end_date);

    const sales = await Sales.find({
      created_at: {
        $gte: start,
        $lte: end,
      },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales by date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// get by id
router.get("/:id", authenticateUser, async (req, res) => {
  const { id: saleId } = req.params;
  const sale = await Sales.findOne({ _id: saleId });
  if (!sale) {
    throw new CustomAPIError.NotFoundError(
      `No sale found for this id ${saleId}`
    );
  }
  res.status(StatusCodes.OK).json({ sale });
});
//update sales
router.patch("/:id", authenticateUser, async (req, res) => {
  const { id: saleId } = req.params;
  const { items } = req.body;
  const sale = await Sales.findOne({ _id: saleId });
  if (!sale) {
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

  checkPermissions(req.user, sale.owner_id);

  sale.items = items;
  sale.total_amount = total_amount;
  await sale.save();
  res.status(StatusCodes.OK).json({ sale });
});
//delete sales
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id: saleId } = req.params;

    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `No sale found for this id ${saleId}` });
    }

    checkPermissions(req.user, sale.owner_id);

    await Sales.deleteOne({ _id: saleId });

    res.status(StatusCodes.OK).json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

export default router;
