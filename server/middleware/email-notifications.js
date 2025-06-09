const { sendEmail, emailTemplates } = require("../utils/email-service")
const User = require("../models/User")
const Teacher = require("../models/Teacher")
const Batch = require("../models/Batch")

// Helper function to get students in a batch
const getStudentsInBatch = async (batchId) => {
  try {
    const batch = await Batch.findById(batchId).populate("students", "name email")
    return batch.students || []
  } catch (error) {
    console.error("Error fetching students in batch:", error)
    return []
  }
}

// Helper function to get teacher for a batch
const getTeacherForBatch = async (batchId) => {
  try {
    const batch = await Batch.findById(batchId).populate("teacher", "name email")
    return batch.teacher
  } catch (error) {
    console.error("Error fetching teacher for batch:", error)
    return null
  }
}

// Helper function to get teacher by ID
const getTeacherById = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId).select("name email")
    return teacher
  } catch (error) {
    console.error("Error fetching teacher by ID:", error)
    return null
  }
}

// Helper function to get student by ID
const getStudentById = async (studentId) => {
  try {
    const student = await User.findById(studentId).select("name email")
    return student
  } catch (error) {
    console.error("Error fetching student by ID:", error)
    return null
  }
}

// Notification for when a teacher creates an assignment
const notifyAssignmentCreated = async (assignment) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(assignment.batch)
    const teacher = await getTeacherById(assignment.teacher)

    if (!teacher) {
      console.error("Teacher not found for assignment:", assignment._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (assignment.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(assignment.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student
    for (const student of students) {
      if (student.email) {
        const template = emailTemplates.assignmentCreated(
          student.name,
          teacher.name,
          assignment.title,
          assignment.dueDate,
          courseName,
        )

        await sendEmail(student.email, template)
      }
    }

    console.log(`Assignment creation notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending assignment creation notifications:", error)
  }
}

// Notification for when a teacher creates an assessment
const notifyAssessmentCreated = async (assessment) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(assessment.batch)
    const teacher = await getTeacherById(assessment.teacher)

    if (!teacher) {
      console.error("Teacher not found for assessment:", assessment._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (assessment.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(assessment.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student
    for (const student of students) {
      if (student.email) {
        const template = emailTemplates.assessmentCreated(
          student.name,
          teacher.name,
          assessment.title,
          assessment.dueDate,
          courseName,
        )

        await sendEmail(student.email, template)
      }
    }

    console.log(`Assessment creation notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending assessment creation notifications:", error)
  }
}

// Notification for when a teacher creates a project
const notifyProjectCreated = async (project) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(project.batch)
    const teacher = await getTeacherById(project.teacher)

    if (!teacher) {
      console.error("Teacher not found for project:", project._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (project.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(project.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student
    for (const student of students) {
      if (student.email) {
        const template = emailTemplates.projectCreated(
          student.name,
          teacher.name,
          project.title,
          project.dueDate,
          courseName,
        )

        await sendEmail(student.email, template)
      }
    }

    console.log(`Project creation notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending project creation notifications:", error)
  }
}

// Notification for when a student submits an assignment
const notifyAssignmentSubmitted = async (submission) => {
  try {
    // Get the teacher for the batch
    const teacher = await getTeacherForBatch(submission.batch)

    if (!teacher || !teacher.email) {
      console.error("Teacher not found or has no email for submission:", submission._id)
      return
    }

    // Get the student
    const student = await getStudentById(submission.student)

    if (!student) {
      console.error("Student not found for submission:", submission._id)
      return
    }

    // Get the assignment
    const Assignment = require("../models/Assignment")
    const assignment = await Assignment.findById(submission.assignment)

    if (!assignment) {
      console.error("Assignment not found for submission:", submission._id)
      return
    }

    const template = emailTemplates.assignmentSubmitted(
      teacher.name,
      student.name,
      assignment.title,
      submission.submittedAt,
    )

    await sendEmail(teacher.email, template)
    console.log(`Assignment submission notification sent to teacher: ${teacher.email}`)
  } catch (error) {
    console.error("Error sending assignment submission notification:", error)
  }
}

// Notification for when a student submits an assessment
const notifyAssessmentSubmitted = async (submission) => {
  try {
    // Get the teacher for the batch
    const teacher = await getTeacherForBatch(submission.batch)

    if (!teacher || !teacher.email) {
      console.error("Teacher not found or has no email for assessment submission:", submission._id)
      return
    }

    // Get the student
    const student = await getStudentById(submission.student)

    if (!student) {
      console.error("Student not found for assessment submission:", submission._id)
      return
    }

    // Get the assessment
    const Assessment = require("../models/Assessment")
    const assessment = await Assessment.findById(submission.assessment)

    if (!assessment) {
      console.error("Assessment not found for submission:", submission._id)
      return
    }

    const template = emailTemplates.assessmentSubmitted(
      teacher.name,
      student.name,
      assessment.title,
      submission.score,
      submission.percentage,
      submission.submittedAt,
    )

    await sendEmail(teacher.email, template)
    console.log(`Assessment submission notification sent to teacher: ${teacher.email}`)
  } catch (error) {
    console.error("Error sending assessment submission notification:", error)
  }
}

// Notification for when a student submits a project
const notifyProjectSubmitted = async (submission) => {
  try {
    // Get the teacher for the batch
    const teacher = await getTeacherForBatch(submission.batch)

    if (!teacher || !teacher.email) {
      console.error("Teacher not found or has no email for project submission:", submission._id)
      return
    }

    // Get the student
    const student = await getStudentById(submission.student)

    if (!student) {
      console.error("Student not found for project submission:", submission._id)
      return
    }

    // Get the project
    const Project = require("../models/Project")
    const project = await Project.findById(submission.project)

    if (!project) {
      console.error("Project not found for submission:", submission._id)
      return
    }

    const template = emailTemplates.projectSubmitted(teacher.name, student.name, project.title, submission.submittedAt)

    await sendEmail(teacher.email, template)
    console.log(`Project submission notification sent to teacher: ${teacher.email}`)
  } catch (error) {
    console.error("Error sending project submission notification:", error)
  }
}

module.exports = {
  notifyAssignmentCreated,
  notifyAssessmentCreated,
  notifyProjectCreated,
  notifyAssignmentSubmitted,
  notifyAssessmentSubmitted,
  notifyProjectSubmitted,
}
