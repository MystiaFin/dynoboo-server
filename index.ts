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

const ORIGIN_URL: string = process.env.ORIGIN_URL as string;

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      ORIGIN_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://192.168.1.4:5173",
    ],
    credentials: true,
  }),
);

app.get("/", (_req: Request, res: Response) => {
  res.send("what are you doing here?");
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
