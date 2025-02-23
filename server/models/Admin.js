const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18, // Assuming admin should be at least 18
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    default: "admin",
  },
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
