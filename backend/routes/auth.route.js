const express = require("express");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");
const Patient = require("../models/patientModel");
const Insurance = require("../models/insuranceModel");
const Inventory = require("../models/inventoryModel");
const PatientEvent = require("../models/patientEventModel");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Generate Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "mediflow_secret_key_12345",
    { expiresIn: "30d" }
  );
};

// @desc    Auth employee & get token
// @route   POST /auth/login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const employee = await Employee.findOne({ email });

    if (employee && (await employee.matchPassword(password))) {
      return res.status(200).json({
        token: generateToken(employee._id),
        user: {
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department
        }
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Get current employee profile
// @route   GET /auth/me
// @access  Protected
router.get("/me", protect, async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Get dashboard metrics for user based on role
// @route   GET /auth/dashboard
// @access  Protected
router.get("/dashboard", protect, async (req, res) => {
  try {
    const role = req.user.role;
    let metrics = {};

    switch (role) {
      case "admin":
        const totalEmployees = await Employee.countDocuments({});
        const totalPatients = await Patient.countDocuments({});
        metrics = {
          role,
          totalEmployees,
          totalPatients,
          systemStatus: "Healthy",
          recentActivity: "No issues reported in last 24 hours"
        };
        break;

      case "doctor":
        const doctorPatients = await Patient.countDocuments({});
        const recentConsultations = await PatientEvent.find({ type: "consultation" })
          .sort({ timestamp: -1 })
          .limit(5);
        metrics = {
          role,
          totalPatients: doctorPatients,
          recentConsultations,
          message: "Check scheduled patient appointments"
        };
        break;

      case "inventory_manager":
        const allMeds = await Inventory.find({});
        const criticalMeds = await Inventory.find({
          $expr: { $lte: ["$current_stock", "$threshold"] }
        });
        metrics = {
          role,
          allInventory: allMeds,
          lowStockMedicines: criticalMeds,
          message: criticalMeds.length > 0
            ? `${criticalMeds.length} medicines need restocking!`
            : "Inventory stocks are sufficient."
        };
        break;

      case "insurance_manager":
        const totalClaims = await Insurance.countDocuments({});
        const latestInsurance = await Insurance.find({})
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("patient_id", "name");
        metrics = {
          role,
          totalClaims,
          latestInsurancePolicies: latestInsurance,
          message: "Review active medical claims"
        };
        break;

      case "nurse":
        const totalEvents = await PatientEvent.countDocuments({});
        const recentEvents = await PatientEvent.find({})
          .sort({ timestamp: -1 })
          .limit(5)
          .populate("patient_id", "name");
        metrics = {
          role,
          totalEventsRecorded: totalEvents,
          recentActivityLog: recentEvents,
          message: "Keep logs updated for discharge reports"
        };
        break;

      default:
        metrics = {
          role,
          message: "General user access"
        };
    }

    return res.status(200).json(metrics);
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
