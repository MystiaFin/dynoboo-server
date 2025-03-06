import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import user from "./routes/userRoutes";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", user);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// I DID THIS ALL BY MYSELF YAY
