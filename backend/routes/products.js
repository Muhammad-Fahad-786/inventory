const express = require("express")
const Joi = require("joi")
const Product = require("../models/Product")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().max(100).required(),
  type: Joi.string().max(50).required(),
  sku: Joi.string().max(20).required(),
  description: Joi.string().max(500).required(),
  quantity: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
  image_url: Joi.string().uri().optional().allow(""),
})

const quantityUpdateSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required(),
})

// Add a New Product
router.post("/products", authMiddleware, async (req, res) => {
  try {
    // Validate input
    const { error, value } = productSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      })
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: value.sku.toUpperCase() })
    if (existingProduct) {
      return res.status(409).json({ message: "SKU already exists" })
    }

    // Create new product
    const product = new Product({
      ...value,
      sku: value.sku.toUpperCase(),
      addCount: 1,
    })

    await product.save()

    res.status(201).json({
      message: "Product added successfully",
      product_id: product._id.toString(),
    })
  } catch (error) {
    console.error("Add product error:", error)

    if (error.code === 11000) {
      return res.status(409).json({ message: "SKU already exists" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
})

// Get All Products (with pagination)
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter object
    const filter = {}
    if (req.query.type) {
      filter.type = new RegExp(req.query.type, "i")
    }
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, "i") },
        { sku: new RegExp(req.query.search, "i") },
        { description: new RegExp(req.query.search, "i") },
      ]
    }

    // Get products with pagination
    const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Update Product Quantity
router.put("/products/:id/quantity", authMiddleware, async (req, res) => {
  try {
    // Validate input
    const { error, value } = quantityUpdateSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      })
    }

    const { quantity } = value
    const productId = req.params.id

    // Find and update product
    const product = await Product.findByIdAndUpdate(productId, { quantity }, { new: true, runValidators: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error("Update quantity error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
})

// Get Single Product
router.get("/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error("Get product error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete Product
router.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
