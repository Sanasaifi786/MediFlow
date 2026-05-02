const path = require("path");
const dotenv = require("dotenv");

// Configure dotenv before everything else
dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");

// Import all models
const Patient = require("../models/patientModel");
const Insurance = require("../models/insuranceModel");
const Inventory = require("../models/inventoryModel");
const PatientEvent = require("../models/patientEventModel");
const Employee = require("../models/employeeModel");

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB for seeding");

    // 2. Delete existing collections to remove stale unique indices
    console.log("Cleaning existing collections to clear stale indices...");
    const collections = ["patients", "insurances", "inventories", "patientevents", "employees"];
    for (const coll of collections) {
      try {
        await mongoose.connection.db.dropCollection(coll);
        console.log(`Dropped collection: ${coll}`);
      } catch (err) {
        // If collection doesn't exist, ignore the error
        if (err.codeName !== "NamespaceNotFound") {
          console.log(`Note for ${coll}: ${err.message}`);
        }
      }
    }
    console.log("Cleaned all collections successfully");

    // 3. Create initial Patients
    console.log("Seeding Patients...");
    const patients = await Patient.create([
      { name: "John Doe",       age: 45, disease: "Chronic Hypertension",    policy_number: "PREM-001", patient_id: "PAT-1001" },
      { name: "Jane Smith",     age: 29, disease: "Type-2 Diabetes",         policy_number: "STD0-002", patient_id: "PAT-1002" },
      { name: "Robert Johnson", age: 60, disease: "Acute Appendicitis",      policy_number: "PREM-003", patient_id: "PAT-1003" },
      { name: "Emily Davis",    age: 34, disease: "Pneumonia",               policy_number: "STD0-004", patient_id: "PAT-1004" },
      { name: "Michael Wilson", age: 52, disease: "Coronary Artery Disease", policy_number: "PREM-005", patient_id: "PAT-1005" }
    ]);
    console.log(`Seeded ${patients.length} patients with readable patient_ids`);

    // 4. Create initial Insurances
    console.log("Seeding Insurances...");
    const insurances = await Insurance.create([
      { patient_id: patients[0].patient_id, policy_type: "Gold Health Plus", policy_number: "PREM-001" },
      { patient_id: patients[1].patient_id, policy_type: "Family Shield", policy_number: "STD0-002" },
      { patient_id: patients[2].patient_id, policy_type: "Senior Platinum", policy_number: "PREM-003" },
      { patient_id: patients[3].patient_id, policy_type: "Individual Basic", policy_number: "STD0-004" },
      { patient_id: patients[4].patient_id, policy_type: "Corporate Premium", policy_number: "PREM-005" }
    ]);
    console.log(`Seeded ${insurances.length} insurance records`);

    // 5. Create initial Inventory
    console.log("Seeding Inventory...");
    const inventories = await Inventory.create([
      { medicine_name: "Metformin", current_stock: 150, threshold: 50 },
      { medicine_name: "Lisinopril", current_stock: 100, threshold: 30 },
      { medicine_name: "Amoxicillin", current_stock: 80, threshold: 25 },
      { medicine_name: "Aspirin", current_stock: 200, threshold: 40 },
      { medicine_name: "Omeprazole", current_stock: 40, threshold: 20 }
    ]);
    console.log(`Seeded ${inventories.length} medicine records in inventory`);

    // 6. Create initial PatientEvents
    console.log("Seeding Patient Events...");
    const patientEvents = await PatientEvent.create([
      {
        patient_id: patients[0].patient_id,
        type: "admission",
        details: "Patient admitted with high blood pressure (180/110).",
        timestamp: new Date("2026-04-28T09:00:00Z")
      },
      {
        patient_id: patients[0].patient_id,
        type: "consultation",
        details: "Consultation with cardiologist Dr. Taylor regarding medication dosage.",
        timestamp: new Date("2026-04-29T11:30:00Z")
      },
      {
        patient_id: patients[2].patient_id,
        type: "surgery",
        details: "Emergency appendectomy performed successfully.",
        timestamp: new Date("2026-05-01T14:00:00Z")
      },
      {
        patient_id: patients[3].patient_id,
        type: "test",
        details: "Chest X-ray taken to monitor pneumonia recovery.",
        timestamp: new Date("2026-05-01T16:45:00Z")
      },
      {
        patient_id: patients[1].patient_id,
        type: "consultation",
        details: "Routine check-up for diabetes management. HbA1c results within normal limits.",
        timestamp: new Date("2026-05-02T10:00:00Z")
      }
    ]);
    console.log(`Seeded ${patientEvents.length} patient events`);

    // 7. Create initial Employees
    console.log("Seeding Employees...");
    const employees = await Employee.create([
      {
        name: "Dr. Sarah Taylor",
        email: "sarah.taylor@mediflow.com",
        password: "password123",
        role: "doctor",
        department: "Cardiology",
        phone: "+1-555-0101",
        salary: 150000,
        hire_date: new Date("2023-01-15")
      },
      {
        name: "James Gordon",
        email: "james.gordon@mediflow.com",
        password: "password123",
        role: "inventory_manager",
        department: "Pharmacy & Supplies",
        phone: "+1-555-0102",
        salary: 65000,
        hire_date: new Date("2024-03-01")
      },
      {
        name: "Linda Vance",
        email: "linda.vance@mediflow.com",
        password: "password123",
        role: "insurance_manager",
        department: "Billing & Claims",
        phone: "+1-555-0103",
        salary: 72000,
        hire_date: new Date("2022-11-20")
      },
      {
        name: "Nurse Rachel Green",
        email: "rachel.green@mediflow.com",
        password: "password123",
        role: "nurse",
        department: "Emergency Medicine",
        phone: "+1-555-0104",
        salary: 80000,
        hire_date: new Date("2025-02-10")
      },
      {
        name: "Arthur Pendragon",
        email: "arthur.pendragon@mediflow.com",
        password: "password123",
        role: "admin",
        department: "Hospital Administration",
        phone: "+1-555-0105",
        salary: 110000,
        hire_date: new Date("2021-06-01")
      },
      {
        name: "Chloe Sullivan",
        email: "chloe.sullivan@mediflow.com",
        password: "password123",
        role: "receptionist",
        department: "Front Desk & Reception",
        phone: "+1-555-0106",
        salary: 45000,
        hire_date: new Date("2024-05-01")
      }
    ]);
    console.log(`Seeded ${employees.length} employee records`);

    console.log("\nDatabase seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
