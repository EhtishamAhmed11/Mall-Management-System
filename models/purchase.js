import mongoose from "mongoose";
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
});

const PurchaseSchema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [ItemSchema],
  total_amount: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const Purchase = mongoose.model("Purchase", PurchaseSchema);

export default Purchase;
