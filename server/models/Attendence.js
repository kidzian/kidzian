const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    lecture: {
      title: String,
      description: String,
      duration: Number, // in minutes
      topic: String,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent", "late", "excused"],
          required: true,
        },
        markedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          trim: true,
        },
        lateMinutes: {
          type: Number,
          default: 0,
        },
      },
    ],
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    presentCount: {
      type: Number,
      default: 0,
    },
    absentCount: {
      type: Number,
      default: 0,
    },
    lateCount: {
      type: Number,
      default: 0,
    },
    attendancePercentage: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockReason: {
      type: String,
      trim: true,
    },
    sessionType: {
      type: String,
      enum: ["lecture", "lab", "tutorial", "exam", "other"],
      default: "lecture",
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for unique attendance per batch per date
attendanceSchema.index({ batch: 1, date: 1 }, { unique: true })
attendanceSchema.index({ markedBy: 1, date: -1 })
attendanceSchema.index({ "records.student": 1, date: -1 })

// Virtual for formatted date
attendanceSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// Method to calculate attendance statistics
attendanceSchema.methods.calculateStats = function () {
  this.totalStudents = this.records.length
  this.presentCount = this.records.filter((record) => record.status === "present").length
  this.absentCount = this.records.filter((record) => record.status === "absent").length
  this.lateCount = this.records.filter((record) => record.status === "late").length

  if (this.totalStudents > 0) {
    this.attendancePercentage = Math.round((this.presentCount / this.totalStudents) * 100)
  } else {
    this.attendancePercentage = 0
  }

  return this
}

// Method to mark attendance for a student
attendanceSchema.methods.markStudentAttendance = function (studentId, status, notes = "", lateMinutes = 0) {
  const existingRecord = this.records.find((record) => record.student.toString() === studentId.toString())

  if (existingRecord) {
    existingRecord.status = status
    existingRecord.notes = notes
    existingRecord.lateMinutes = lateMinutes
    existingRecord.markedAt = new Date()
  } else {
    this.records.push({
      student: studentId,
      status: status,
      notes: notes,
      lateMinutes: lateMinutes,
    })
  }

  this.calculateStats()
  return this
}

// Method to get attendance for a specific student
attendanceSchema.methods.getStudentAttendance = function (studentId) {
  return this.records.find((record) => record.student.toString() === studentId.toString())
}

// Method to bulk mark attendance
attendanceSchema.methods.bulkMarkAttendance = function (attendanceData) {
  attendanceData.forEach(({ studentId, status, notes, lateMinutes }) => {
    this.markStudentAttendance(studentId, status, notes, lateMinutes)
  })
  return this
}

// Static method to get attendance summary for a student
attendanceSchema.statics.getStudentSummary = async function (studentId, batchId, startDate, endDate) {
  const query = {
    batch: batchId,
    "records.student": studentId,
  }

  if (startDate || endDate) {
    query.date = {}
    if (startDate) query.date.$gte = new Date(startDate)
    if (endDate) query.date.$lte = new Date(endDate)
  }

  const attendanceRecords = await this.find(query).sort({ date: 1 })

  const summary = {
    totalClasses: attendanceRecords.length,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendancePercentage: 0,
    records: [],
  }

  attendanceRecords.forEach((record) => {
    const studentRecord = record.records.find((r) => r.student.toString() === studentId.toString())
    if (studentRecord) {
      summary[studentRecord.status]++
      summary.records.push({
        date: record.date,
        status: studentRecord.status,
        notes: studentRecord.notes,
        lateMinutes: studentRecord.lateMinutes,
        lecture: record.lecture,
      })
    }
  })

  if (summary.totalClasses > 0) {
    summary.attendancePercentage = Math.round((summary.present / summary.totalClasses) * 100)
  }

  return summary
}

// Static method to get batch attendance summary
attendanceSchema.statics.getBatchSummary = async function (batchId, startDate, endDate) {
  const query = { batch: batchId }

  if (startDate || endDate) {
    query.date = {}
    if (startDate) query.date.$gte = new Date(startDate)
    if (endDate) query.date.$lte = new Date(endDate)
  }

  const attendanceRecords = await this.find(query).sort({ date: 1 })

  const summary = {
    totalClasses: attendanceRecords.length,
    averageAttendance: 0,
    totalStudents: 0,
    classWiseSummary: [],
  }

  let totalAttendancePercentage = 0

  attendanceRecords.forEach((record) => {
    summary.classWiseSummary.push({
      date: record.date,
      totalStudents: record.totalStudents,
      presentCount: record.presentCount,
      absentCount: record.absentCount,
      lateCount: record.lateCount,
      attendancePercentage: record.attendancePercentage,
      lecture: record.lecture,
    })

    totalAttendancePercentage += record.attendancePercentage
  })

  if (summary.totalClasses > 0) {
    summary.averageAttendance = Math.round(totalAttendancePercentage / summary.totalClasses)
  }

  return summary
}

// Pre-save middleware to calculate stats
attendanceSchema.pre("save", function (next) {
  this.calculateStats()
  next()
})

// Pre-save middleware to validate date
attendanceSchema.pre("save", function (next) {
  if (this.date > new Date()) {
    next(new Error("Attendance date cannot be in the future"))
  } else {
    next()
  }
})

module.exports = mongoose.model("Attendance", attendanceSchema)
