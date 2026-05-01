const express = require("express");
const insuranceRoute = require("./routes/insurance.route");

const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());

app.use("/insurance", insuranceRoute);
const dischargeRoute = require("./routes/discharge.route");
app.use("/discharge", dischargeRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
