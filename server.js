const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Routes
const scores = require('./routes/scores');
const auth = require('./routes/auth');

const app = express();

app.use('/api', auth);
app.use('/api/:userId/scores', scores);

const port = process.env.PORT || 5000;

const server = app.listen(
  port,
  console.log(`Server running on port ${port}...`)
);
