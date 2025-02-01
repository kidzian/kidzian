const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    trim: true,
    lowercase: true, // Converts email to lowercase
    match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  age: {
    type: Number,
    required: true,
    min: 5, // Minimum age
    max: 18, // Maximum age (assuming this is for kids)
  },
  phoneNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  grade: {
    type: Number,
    required: true,
    trim: true,
  },
  certificates: { type: Number, default: 0 },

  courses: [
    {
      course: { type: String  },
      image: { type: String},
      startingDate: { type: Date },
      completion: { type: Number}, // Integer percentage of completion
      totalClasses: { type: Number}, // Total number of classes in course
      lecturesCompleted: { type: Number, default: 0 }, // Completed lectures count
      lecturesAttended: { type: Number, default: 0 }, // Attended lectures count
      lecturesUpcoming: { type: Number, default: 0 }, // Upcoming lectures count
      lectures: [
        {
          name: { type: String}, // Lecture name
          attendance: { type: Boolean, default: false }, // Whether attended or not
        },
      ],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});


// Create the User model
module.exports=mongoose.model('User',userSchema);
