import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userroutes";

const app = express();
const port: number = 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

// Routes
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
