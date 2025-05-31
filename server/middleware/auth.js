const jwt = require("jsonwebtoken")

// Middleware to authenticate and authorize users
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    // Get token from header
    const token = req.header("Authorization")?.split(" ")[1]

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)

      // Set user info in request
      req.user = decoded

      // Check if user has required role
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" })
      }

      next()
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" })
    }
  }
}
