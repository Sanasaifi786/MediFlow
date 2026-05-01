const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  minThreshold: {
    type: Number,
    default: 10,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);
