// Imports
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const xss = require('xss-clean');
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

// Security middleware
app.use(cors());
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
});
app.use('/api/', apiLimiter);

app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
		directives: {
			scriptSrc: [
				"'self'",
				'code.jquery.com',
				'cdnjs.cloudflare.com',
				'stackpath.bootstrapcdn.com',
			],
			imgSrc: ["'self'", 'data:', 'images.unsplash.com'],
		},
		reportOnly: false,
	})
);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes'));

// Set port
const port = process.env.PORT || 5000;

// Start server
const server = app.listen(
	port,
	console.log(`Server running in ${process.env.NODE_ENV} on port ${port}...`)
);
