"use client"

import { useState, useEffect } from "react"
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Alert,
} from "@mui/material"
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material"
import axios from "axios"

function Analytics() {
  const [topProducts, setTopProducts] = useState([])
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalInventoryValue: 0,
    totalQuantity: 0,
    lowStockProducts: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const [topProductsResponse, summaryResponse] = await Promise.all([
        axios.get("/api/analytics/top-products?limit=10"),
        axios.get("/api/analytics/summary"),
      ])

      setTopProducts(topProductsResponse.data)
      setSummary(summaryResponse.data)
    } catch (error) {
      setError("Failed to fetch analytics data")
      console.error("Analytics error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <TrendingUpIcon sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Analytics Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">{summary.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Inventory Value
              </Typography>
              <Typography variant="h4" color="primary">
                ${summary.totalInventoryValue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Quantity
              </Typography>
              <Typography variant="h4">{summary.totalQuantity}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="error">
                {summary.lowStockProducts}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {"< 10 units"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Products Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Most Frequently Added Products
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Products ranked by how often they have been added to inventory
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Add Count</TableCell>
                <TableCell align="right">Current Stock</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      #{index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{product.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {product.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="secondary">
                      {product.addCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" color={product.quantity < 10 ? "error" : "textPrimary"}>
                      {product.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {topProducts.length === 0 && !loading && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="textSecondary">
              No products found. Add some products to see analytics.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default Analytics
