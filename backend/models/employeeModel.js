const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: [true, "Employee role is required"],
      trim: true,
      enum: {
        values: ["doctor", "inventory_manager", "insurance_manager", "nurse", "admin"],
        message: "{VALUE} is not a valid employee role",
      },
    },
    department: {
      type: String,
      required: [true, "Department description is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, "Employee salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    hire_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster searches
employeeSchema.index({ name: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ role: 1 });

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
