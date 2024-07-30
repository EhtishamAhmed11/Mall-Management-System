// index.js
import express from "express";
import userRoutes from "./routes/user.js";
import shopRoutes from "./routes/shop.js";
import salesRoutes from "./routes/sales.js";
import purchaseRoutes from "./routes/purchase.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const corsOption = {
  origin:"http://localhost:5173",
  credentials: true,

}
app.use(cors(corsOption))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.JWT_SEC));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successful")    
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => res.send("API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/purchase", purchaseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
