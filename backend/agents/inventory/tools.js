const Inventory = require("../../models/Inventory");

const checkStock = async (itemName) => {
  try {
    const item = await Inventory.findOne({ itemName: new RegExp(itemName, "i") });
    if (!item) return { error: `Item "${itemName}" not found in inventory.` };
    return {
      itemName: item.itemName,
      quantity: item.quantity,
      status: item.quantity > item.minThreshold ? "In Stock" : "Low Stock",
    };
  } catch (error) {
    return { error: error.message };
  }
};

const updateStock = async (itemName, change, category = "General") => {
  try {
    let item = await Inventory.findOne({ itemName: new RegExp(itemName, "i") });
    if (!item) {
      item = new Inventory({
        itemName,
        quantity: change,
        category,
      });
    } else {
      item.quantity += change;
      item.lastUpdated = Date.now();
    }
    await item.save();
    return {
      success: true,
      itemName: item.itemName,
      newQuantity: item.quantity,
    };
  } catch (error) {
    return { error: error.message };
  }
};

const getLowStock = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$minThreshold"] },
    });
    return lowStockItems.map((item) => ({
      itemName: item.itemName,
      quantity: item.quantity,
      minThreshold: item.minThreshold,
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
