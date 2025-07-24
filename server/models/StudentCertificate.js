const mongoose = require("mongoose")

const studentCertificateSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  certificateName: {
    type: String,
    required: true,
    trim: true,
  },
  issuedBy: {
    type: String,
    default: "KIDZIAN",
    trim: true,
  },
  dateIssued: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
  certificateId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Generate unique certificate ID before saving
studentCertificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    this.certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }
  next()
})

module.exports = mongoose.model("StudentCertificate", studentCertificateSchema)

