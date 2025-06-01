const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

// Define the Teacher schema
const teacherSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
   select: false // Or more for better security
  },
  role: {
    type: String,
    default: "teacher",
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits long'] // Assuming a 10-digit phone number
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Pre-save hook to hash password if modified or new
teacherSchema.pre('save', async function(next) {
  // Only hash if password is new or changed
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Create a model for Teacher
const Teacher = mongoose.model('Teacher', teacherSchema);

// Export the model
module.exports = Teacher;
