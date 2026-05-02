const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const insuranceRoute = require("./routes/insurance.route");
const inventoryRoute = require("./routes/inventory.route");
const brainRoute = require("./routes/brain.route");
const dischargeRoute = require("./routes/discharge.route");
const authRoute = require("./routes/auth.route");
const promptsRoute = require("./routes/prompts.route");
const nurseRoute = require("./routes/nurse.route");
const connectDB = require("./config/connectDB");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/insurance", insuranceRoute);
app.use("/inventory", inventoryRoute);
app.use("/brain", brainRoute);
app.use("/discharge", dischargeRoute);
app.use("/auth", authRoute);
app.use("/prompts", promptsRoute);
app.use("/nurse", nurseRoute);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
  catch (err) {
    console.error("Error starting server", err);
    process.exit(1);
  }
}
startServer();