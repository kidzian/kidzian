const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Teacher=require("../models/Teacher")  // Adjust path according to your project structure

async function hashExistingPasswords() {
  await mongoose.connect('mongodb+srv://admin:admin@cluster0.wh4xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'); // Change to your DB URI

  const teachers = await Teacher.find();

  for (const teacher of teachers) {
    // Naive check: bcrypt hashes start with $2a$, $2b$, or $2y$
    if (!teacher.password.startsWith('$2')) {
      console.log(`Hashing password for user ${teacher.email}`);

      const salt = await bcrypt.genSalt(10);
      teacher.password = await bcrypt.hash(teacher.password, salt);
      await teacher.save();
    }
  }

  console.log('Password migration complete!');
  await mongoose.disconnect();
}

hashExistingPasswords().catch(console.error);
