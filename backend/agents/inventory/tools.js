const Inventory = require("../../models/inventoryModel");

const checkStock = async (itemName) => {
  try {
    const item = await Inventory.findOne({ medicine_name: new RegExp(itemName, "i") });
    if (!item) return { error: `Item "${itemName}" not found in inventory.` };
    return {
      itemName: item.medicine_name,
      quantity: item.current_stock,
      status: item.current_stock > item.threshold ? "In Stock" : "Low Stock",
    };
  } catch (error) {
    return { error: error.message };
  }
};

const updateStock = async (itemName, change) => {
  try {
    let item = await Inventory.findOne({ medicine_name: new RegExp(itemName, "i") });
    if (!item) {
      return { error: `Item "${itemName}" not found in inventory.` };
    }
    item.current_stock += change;
    if (item.current_stock < 0) {
      return { error: `Cannot deduct stock below 0. Current stock is ${item.current_stock - change}.` };
    }
    await item.save();
    return {
      success: true,
      itemName: item.medicine_name,
      newQuantity: item.current_stock,
    };
  } catch (error) {
    return { error: error.message };
  }
};

const getLowStock = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$current_stock", "$threshold"] },
    });
    return lowStockItems.map((item) => ({
      itemName: item.medicine_name,
      quantity: item.current_stock,
      threshold: item.threshold,
    }));
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  checkStock,
  updateStock,
  getLowStock,
};
