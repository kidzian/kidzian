const fs = require("fs").promises
const path = require("path")
const multer = require("multer")

// Enhanced file storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads")
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, extension)

    // Sanitize filename
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "_")
    const fileName = `${sanitizedBaseName}_${uniqueSuffix}${extension}`

    cb(null, fileName)
  },
})

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",

    // Code files
    "text/x-python",
    "application/x-python-code",
    "text/html",
    "text/css",
    "application/javascript",
    "text/javascript",
    "application/json",
    "text/xml",
    "application/xml",

    // Archives
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",

    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
  ]

  // Also check file extensions for code files
  const allowedExtensions = [
    ".py",
    ".html",
    ".css",
    ".js",
    ".java",
    ".cpp",
    ".c",
    ".cs",
    ".php",
    ".rb",
    ".go",
    ".rs",
    ".swift",
    ".kt",
    ".scala",
    ".dart",
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".zip",
    ".rar",
    ".7z",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
  ]

  const fileExtension = path.extname(file.originalname).toLowerCase()

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true)
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype} (${fileExtension})`), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1, // Only one file per upload
  },
})

// Utility functions
const fileManager = {
  // Get file info
  getFileInfo: async (filePath) => {
    try {
      const stats = await fs.stat(filePath)
      return {
        exists: true,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      }
    } catch (error) {
      return { exists: false }
    }
  },

  // Ensure uploads directory exists
  ensureUploadsDir: async () => {
    const uploadsDir = path.join(process.cwd(), "uploads")
    try {
      await fs.access(uploadsDir)
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.mkdir(uploadsDir, { recursive: true })
        console.log("Created uploads directory")
      }
    }
  },

  // Clean up old files (utility function)
  cleanupOldFiles: async (daysOld = 30) => {
    const uploadsDir = path.join(process.cwd(), "uploads")
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    try {
      const files = await fs.readdir(uploadsDir)
      let deletedCount = 0

      for (const file of files) {
        const filePath = path.join(uploadsDir, file)
        const stats = await fs.stat(filePath)

        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath)
          deletedCount++
          console.log(`Deleted old file: ${file}`)
        }
      }

      return { success: true, deletedCount }
    } catch (error) {
      console.error("Error cleaning up old files:", error)
      return { success: false, error: error.message }
    }
  },
}

module.exports = {
  upload,
  fileManager,
}
