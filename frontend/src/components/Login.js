"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Paper, TextField, Button, Typography, Box, Alert, Tab, Tabs } from "@mui/material"
import { useAuth } from "../contexts/AuthContext"

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>
}

function Login() {
  const [tabValue, setTabValue] = useState(0)
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setError("")
    setSuccess("")
    setFormData({ username: "", password: "" })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (tabValue === 0) {
      // Login
      const result = await login(formData.username, formData.password)
      if (result.success) {
        navigate("/")
      } else {
        setError(result.message)
      }
    } else {
      // Register
      const result = await register(formData.username, formData.password)
      if (result.success) {
        setSuccess("Registration successful! Please login.")
        setTabValue(0)
        setFormData({ username: "", password: "" })
      } else {
        setError(result.message)
      }
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Inventory Management System
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleInputChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleInputChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
