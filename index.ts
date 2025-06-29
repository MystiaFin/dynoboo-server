import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();

// Module Imports
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import Routes
import userRoutes from "./src/routes/userRoutes";
import productRoutes from "./src/routes/productRoutes";

const app = express();
const port: number = 3000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (_req: Request, res: Response) => {
  res.send("hello world!");
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
