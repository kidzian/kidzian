const fs = require("fs")
const path = require("path")

// Debug function to test email attachments
const debugEmailAttachment = (filePath, fileName) => {
  console.log("=== EMAIL ATTACHMENT DEBUG ===")
  console.log(`Original file path: ${filePath}`)
  console.log(`File name: ${fileName}`)

  // Check if path is absolute
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)
  console.log(`Full path: ${fullPath}`)

  // Check if file exists
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath)
    console.log(`✅ File exists`)
    console.log(`File size: ${stats.size} bytes (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
    console.log(`File modified: ${stats.mtime}`)

    // Check file permissions
    try {
      fs.accessSync(fullPath, fs.constants.R_OK)
      console.log(`✅ File is readable`)
    } catch (err) {
      console.log(`❌ File is not readable: ${err.message}`)
    }

    // Get file extension and suggest content type
    const ext = path.extname(fileName).toLowerCase()
    let contentType = "application/octet-stream"

    switch (ext) {
      case ".pdf":
        contentType = "application/pdf"
        break
      case ".doc":
        contentType = "application/msword"
        break
      case ".docx":
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        break
      case ".txt":
        contentType = "text/plain"
        break
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg"
        break
      case ".png":
        contentType = "image/png"
        break
      case ".zip":
        contentType = "application/zip"
        break
    }

    console.log(`Suggested content type: ${contentType}`)
  } else {
    console.log(`❌ File does not exist at: ${fullPath}`)

    // Check if directory exists
    const dir = path.dirname(fullPath)
    if (fs.existsSync(dir)) {
      console.log(`✅ Directory exists: ${dir}`)
      const files = fs.readdirSync(dir)
      console.log(`Files in directory: ${files.join(", ")}`)
    } else {
      console.log(`❌ Directory does not exist: ${dir}`)
    }
  }

  console.log("=== END DEBUG ===")

  return {
    exists: fs.existsSync(fullPath),
    fullPath,
    contentType,
  }
}

// Test email configuration
const testEmailConfig = () => {
  console.log("=== EMAIL CONFIG DEBUG ===")
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? "✅ Set" : "❌ Not set"}`)
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? "✅ Set" : "❌ Not set"}`)
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || "smtp.gmail.com (default)"}`)
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || "587 (default)"}`)
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || "Not set (using default)"}`)
  console.log("=== END EMAIL CONFIG DEBUG ===")
}

module.exports = {
  debugEmailAttachment,
  testEmailConfig,
}
