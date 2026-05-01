const express = require("express");
const insuranceRoute = require("./routes/insurance.route");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());

app.use("/insurance", insuranceRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
