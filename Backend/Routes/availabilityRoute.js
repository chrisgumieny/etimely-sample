// Import method
const express = require('express');
const { 
    addAvailability, 
    getAvailability, 
    deleteAvailability, 
    updateAvailability, 
    verifyAvailability 
} = require('../Controllers/availabilityController');

// Creates router
const router = express.Router();

// Creates api endpoints
// Add availability
router.post('/availability/add/:staffId', addAvailability);

// Gets availability
router.get('/availability/getAvailability/:staffId', getAvailability);

// Delete availability
router.delete('/availability/:availabilityId', deleteAvailability);

// Update availability
router.post('/availability/updateAvailability', updateAvailability);

// Verify availability
router.put('/availability/verifyAvailability/:availabilityId', verifyAvailability);

// Exports router
module.exports = {
    routes: router
}