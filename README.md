# Full-Stack Inventory Management System

A complete inventory management application built with Node.js/Express backend, React frontend, and MongoDB database, fully containerized with Docker.

## 🚀 Features

### Backend API
- **User Authentication**: JWT-based registration and login
- **Product Management**: CRUD operations for inventory items
- **Analytics**: Track most frequently added products
- **Pagination**: Efficient data retrieval with pagination support
- **Security**: Password hashing, input validation, rate limiting
- **API Documentation**: Swagger/OpenAPI documentation

### Frontend Portal
- **Admin Dashboard**: View and manage all products
- **Product Management**: Add new products and update quantities
- **Analytics Dashboard**: View inventory statistics and trends
- **Responsive Design**: Material-UI components for mobile-friendly interface
- **Authentication**: Secure login/registration with JWT tokens

### Infrastructure
- **Containerization**: Docker containers for all services
- **Database**: MongoDB with Mongoose ODM
- **Development**: Hot reload for both frontend and backend
- **Production Ready**: Multi-stage builds and optimized containers

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt.js, Helmet, CORS, Rate Limiting
- **Validation**: Joi

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **HTTP Client**: Axios
- **Build Tool**: Create React App

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (production)
- **Environment**: Environment variables for configuration

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB (for local development)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd inventory-management-system
   \`\`\`

2. **Start all services**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. **Create your first user**
   - Navigate to http://localhost:3000
   - Click "Register" tab
   - Create a new account
   - Login and start managing inventory!

### Local Development

1. **Start MongoDB**
   \`\`\`bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   \`\`\`

2. **Backend Setup**
   \`\`\`bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   \`\`\`

3. **Frontend Setup**
   \`\`\`bash
   cd frontend
   npm install
   npm start
   \`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000
\`\`\`

### Docker Environment

The `docker-compose.yml` includes default environment variables. For production, update:

- `JWT_SECRET`: Use a strong, unique secret key
- `MONGO_INITDB_ROOT_PASSWORD`: Change the default MongoDB password
- Add SSL/TLS certificates for HTTPS

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
