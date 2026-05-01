const mongoose = require('mongoose');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'models');

const models = [
  'patientModel.js',
  'patientEventModel.js',
  'inventoryModel.js',
  'insuranceModel.js'
];

console.log('--- Testing Model Loading ---');

models.forEach(file => {
  try {
    const model = require(path.join(modelsDir, file));
    console.log(`✅ Successfully loaded ${file}: ${model.modelName}`);
  } catch (error) {
    console.error(`❌ Failed to load ${file}:`, error.message);
  }
});

console.log('--- Testing Inventory Agent Tools ---');
try {
    const tools = require('../agents/inventory/tools');
    console.log('✅ Successfully loaded Inventory Agent Tools');
    console.log('Functions exported:', Object.keys(tools).join(', '));
} catch (error) {
    console.error('❌ Failed to load Inventory Agent Tools:', error.message);
}

process.exit(0);
