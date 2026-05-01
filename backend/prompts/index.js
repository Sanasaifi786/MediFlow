const insurancePrompts = require('./insurance');
const inventoryPrompts = require('./inventory');
const dischargePrompts = require('./discharge');

module.exports = {
  ...insurancePrompts,
  ...inventoryPrompts,
  ...dischargePrompts
};
