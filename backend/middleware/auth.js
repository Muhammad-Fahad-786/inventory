const jwt = require("jsonwebtoken")
const User = require("../models/User")

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization")

    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const token = authHeader.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. Invalid token format." })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "Access denied. User not found." })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Access denied. Invalid token." })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access denied. Token expired." })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = authMiddleware
