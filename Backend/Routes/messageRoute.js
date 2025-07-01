// Import methods
const express = require('express');
const {
    createMessageByBusiness, 
    createMessageByStaff
} = require('../Controllers/messageController');

const router = express.Router();

// Create routes api endpoints
// POST routes
router.post('/createMessage/:companyId', createMessageByBusiness); // Endpoint to create message
router.post('/createMessageByStaff/:staffId/:companyId', createMessageByStaff); // Endpoint to create message

// Export router
module.exports = {
    routes: router
}