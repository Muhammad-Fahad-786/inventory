const express = require("express")
const Product = require("../models/Product")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Basic Analytics Endpoint - Top Products by Add Count
router.get("/analytics/top-products", authMiddleware, async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 10

    const topProducts = await Product.find()
      .sort({ addCount: -1 })
      .limit(limit)
      .select("name type sku addCount price quantity")

    res.status(200).json(topProducts)
  } catch (error) {
    console.error("Analytics error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Additional analytics endpoints
router.get("/analytics/summary", authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const totalValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ])

    const lowStockProducts = await Product.countDocuments({ quantity: { $lt: 10 } })

    res.status(200).json({
      totalProducts,
      totalInventoryValue: totalValue[0]?.totalValue || 0,
      totalQuantity: totalValue[0]?.totalQuantity || 0,
      lowStockProducts,
    })
  } catch (error) {
    console.error("Summary analytics error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
