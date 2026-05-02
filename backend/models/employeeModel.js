const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    password: {
      type: String,
      required: [true, "Password is required"],
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

// Encrypt password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add index for faster searches
employeeSchema.index({ name: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ role: 1 });

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
