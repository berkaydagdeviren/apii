// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { cacheMiddleware }  = require ('./config/cache');
const productRoutes = require('./routes/productRoutes');
const companyRoutes = require('./routes/companyRoutes');
const retailRecordRoutes = require('./routes/retailRecordRoutes');
const openAccountRoutes = require('./routes/openAccountRoutes');
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], // Add your frontend URL here
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cacheMiddleware);
// Routes
app.use('/api/products', productRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/retail-records', retailRecordRoutes);
app.use('/api/open-account-records', openAccountRoutes);
// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});