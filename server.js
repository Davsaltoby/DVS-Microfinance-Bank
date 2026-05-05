import "dotenv/config";
import express from "express";
import identityRouter from "./routes/identityCreationRoute.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import enquiryRoute from "./routes/enquiryRoute.js";
import transferRoute from "./routes/transferRoute.js";
import transactionStatusRoute from "./routes/transactionStatusRoute.js";

import connectDB from "./config/db.js";

const app = express();

app.use(express.json());

app.use("/api/admin", adminRouter);
app.use("/api/identity", identityRouter);
app.use("/api/auth", userRouter);
app.use("/api/account", enquiryRoute);
app.use("/api/transfer", transferRoute);
app.use("/api/transaction", transactionStatusRoute);

const PORT = process.env.PORT || 3000;

const server = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is runnning on port: ${PORT}`);
  });
};

server();
