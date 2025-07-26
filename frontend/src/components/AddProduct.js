"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Typography, TextField, Button, Box, Paper, Grid, Alert } from "@mui/material"
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import axios from "axios"

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    sku: "",
    description: "",
    quantity: "",
    price: "",
    image_url: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Convert quantity and price to numbers
      const productData = {
        ...formData,
        quantity: Number.parseInt(formData.quantity),
        price: Number.parseFloat(formData.price),
      }

      // Remove empty image_url
      if (!productData.image_url.trim()) {
        delete productData.image_url
      }

      const response = await axios.post("/api/products", productData)

      setSuccess(`Product added successfully! ID: ${response.data.product_id}`)

      // Reset form
      setFormData({
        name: "",
        type: "",
        sku: "",
        description: "",
        quantity: "",
        price: "",
        image_url: "",
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add product")
      console.error("Add product error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mr: 2 }}>
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1">
          Add New Product
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleInputChange}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="type"
                label="Product Type"
                value={formData.type}
                onChange={handleInputChange}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="sku"
                label="SKU"
                value={formData.sku}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }}
                helperText="Stock Keeping Unit (unique identifier)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: "$",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="quantity"
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="image_url"
                label="Image URL"
                type="url"
                value={formData.image_url}
                onChange={handleInputChange}
                helperText="Optional: HTTP/HTTPS URL to product image"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.description.length}/500 characters`}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button type="submit" variant="contained" disabled={loading} size="large">
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/")} size="large">
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default AddProduct
