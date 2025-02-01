const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: [/.+\@.+\..+/, 'Please enter a valid email address'] },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, required: true, min: 5, max: 18 },
  phoneNumber: { type: Number, required: true, trim: true },
  grade: { type: Number, required: true, trim: true },
  certificates: { type: Number, default: 0 },
  batches: [
    {
      batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Course
      startingDate: { type: Date },
      completion: { type: Number },
      totalClasses: { type: Number },
      lecturesCompleted: { type: Number, default: 0 },
      lecturesAttended: { type: Number, default: 0 },
      lecturesUpcoming: { type: Number, default: 0 },
      lectures: [
        {
          name: { type: String },
          attendance: { type: Boolean, default: false },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports=mongoose.model('User',userSchema);