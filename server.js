// Imports
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Initialize server
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(require('./routes'));

// Set port
const port = process.env.PORT || 5000;

// Start server
const server = app.listen(
  port,
  console.log(`Server running on port ${port}...`)
);
