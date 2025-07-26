const express = require("express")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const User = require("../models/User")

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

// User Registration
router.post("/register", async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      })
    }

    const { username, password } = value

    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" })
    }

    // Create new user
    const user = new User({ username, password })
    await user.save()

    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    console.error("Registration error:", error)

    if (error.code === 11000) {
      return res.status(409).json({ message: "Username already exists" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
})

// User Login
router.post("/login", async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      })
    }

    const { username, password } = value

    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "24h" })

    res.status(200).json({ access_token: token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
