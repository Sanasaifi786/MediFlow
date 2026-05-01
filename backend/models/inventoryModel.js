const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    medicine_name: {
      type: String,
      required: true,
    },
    current_stock: {
      type: Number,
      default: 0,
    },
    threshold: {
      type: Number,
      default: 10,
    },
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
