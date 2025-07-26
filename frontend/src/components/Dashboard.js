"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Pagination,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material"
import axios from "axios"

function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  })
  const [editDialog, setEditDialog] = useState({
    open: false,
    product: null,
    quantity: "",
  })
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockProducts: 0,
  })

  const navigate = useNavigate()

  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true)
    try {
      const response = await axios.get("/api/products", {
        params: {
          page,
          limit: 10,
          search,
        },
      })
      setProducts(response.data.products)
      setPagination(response.data.pagination)
    } catch (error) {
      setError("Failed to fetch products")
      console.error("Fetch products error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await axios.get("/api/analytics/summary")
      setSummary(response.data)
    } catch (error) {
      console.error("Fetch summary error:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchSummary()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(1, searchTerm)
  }

  const handlePageChange = (event, page) => {
    fetchProducts(page, searchTerm)
  }

  const handleEditQuantity = (product) => {
    setEditDialog({
      open: true,
      product,
      quantity: product.quantity.toString(),
    })
  }

  const handleUpdateQuantity = async () => {
    try {
      const quantity = Number.parseInt(editDialog.quantity)
      if (isNaN(quantity) || quantity < 0) {
        setError("Please enter a valid quantity")
        return
      }

      await axios.put(`/api/products/${editDialog.product._id}/quantity`, {
        quantity,
      })

      setSuccess("Quantity updated successfully")
      setEditDialog({ open: false, product: null, quantity: "" })
      fetchProducts(pagination.currentPage, searchTerm)
      fetchSummary()
    } catch (error) {
      setError("Failed to update quantity")
      console.error("Update quantity error:", error)
    }
  }

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "sku", headerName: "SKU", width: 120 },
    { field: "type", headerName: "Type", width: 120 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value < 10 ? "error" : "success"} size="small" />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditQuantity(params.row)}>
          Edit Qty
        </Button>
      ),
    },
  ]

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Product Dashboard
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/add-product")}>
          Add Product
        </Button>
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h5">{summary.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inventory Value
              </Typography>
              <Typography variant="h5">${summary.totalInventoryValue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h5" color="error">
                {summary.lowStockProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} display="flex" gap={2}>
          <TextField
            fullWidth
            label="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, SKU, or description"
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>
      </Paper>

      {/* Products Table */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          hideFooterPagination
          hideFooter
        />
      </Paper>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Edit Quantity Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, product: null, quantity: "" })}>
        <DialogTitle>Update Quantity</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Product: {editDialog.product?.name}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={editDialog.quantity}
            onChange={(e) => setEditDialog({ ...editDialog, quantity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, product: null, quantity: "" })}>Cancel</Button>
          <Button onClick={handleUpdateQuantity} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Dashboard
