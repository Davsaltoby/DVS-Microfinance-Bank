import "dotenv/config";
import express from "express";
import dvsRouter from "./routes/dvsRoute.js";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());

app.use("/dvs", dvsRouter);
app.use("/api/auth", userRouter);

const PORT = process.env.PORT || 3000;

const server = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is runnning on port: ${PORT}`);
  });
};

server();
