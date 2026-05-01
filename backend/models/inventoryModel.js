const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    medicine_name: {
      type: String,
      required: [true, "Medicine name is required"],
      unique: true,
      trim: true,
    },
    current_stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    threshold: {
      type: Number,
      default: 10,
      min: [0, "Threshold cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
