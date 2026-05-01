const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const insuranceRoute = require("./routes/insurance.route");
const inventoryRoute = require("./routes/inventory.route");
const brainRoute = require("./routes/brain.route");
const dischargeRoute = require("./routes/discharge.route");

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mediflow";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/insurance", insuranceRoute);
app.use("/inventory", inventoryRoute);
app.use("/brain", brainRoute);
app.use("/discharge", dischargeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
