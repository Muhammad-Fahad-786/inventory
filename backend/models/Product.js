const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Product type is required"],
      trim: true,
      maxlength: [50, "Product type cannot exceed 50 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, "SKU cannot exceed 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image_url: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Image URL must be a valid HTTP/HTTPS URL",
      },
    },
    addCount: {
      type: Number,
      default: 1,
      min: [1, "Add count must be at least 1"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
productSchema.index({ sku: 1 })
productSchema.index({ name: 1 })
productSchema.index({ type: 1 })
productSchema.index({ addCount: -1 })

module.exports = mongoose.model("Product", productSchema)
