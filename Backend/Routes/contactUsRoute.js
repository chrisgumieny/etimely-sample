// Import methods
const express = require('express');
const {
    addContactUs
} = require('../Controllers/contactUsController');

// Create router
const router = express.Router();

// Create routes api endpoints
// POST routes
router.post('/contactUs', addContactUs);

// Export router
module.exports = {
    routes: router
}