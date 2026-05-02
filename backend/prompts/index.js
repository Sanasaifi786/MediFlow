const insurancePrompts = require('./insurance');
const inventoryPrompts = require('./inventory');
const dischargePrompts = require('./discharge');
const brainPrompts = require('./brain');

module.exports = {
  ...insurancePrompts,
  ...inventoryPrompts,
  ...dischargePrompts,
  ...brainPrompts
};
