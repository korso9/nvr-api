const dotenv = require('dotenv');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

// Load env vars
dotenv.config({ path: './config/config.env' });

const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

module.exports = mg;