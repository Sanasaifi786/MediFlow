const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });
const Inventory = require("./backend/models/inventoryModel");
const connectDB = require("./backend/config/connectDB");

async function updateCrocin() {
  try {
    await connectDB();
    console.log("Connected to DB");
    
    let item = await Inventory.findOne({ medicine_name: /crocin/i });
    if (!item) {
      item = new Inventory({
        medicine_name: "Crocin",
        current_stock: 500,
        threshold: 50
      });
      console.log("Created new Crocin record");
    } else {
      item.current_stock = 500;
      console.log("Updated existing Crocin record");
    }
    
    await item.save();
    console.log("Saved successfully. New stock: 500");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateCrocin();
