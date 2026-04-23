import "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());

app.get("/checkout", (req, res) => {
  res.json({ message: "Checkout endpoint" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is runnning on port: ${PORT}`);
});
