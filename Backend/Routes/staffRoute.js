// Import methods
const express = require('express');
const { 
    verifyStaff, 
    updateStaffUser, 
    updateStaffUserPassword, 
    getStaffUserById
} = require('../Controllers/staffController');
const { loginBusiness } = require('../Controllers/loginController');

// Create router
const router = express.Router();

// POST routes
router.post('/login', loginBusiness);


// verifyStaff
router.get('/staff/verify/:token', verifyStaff);


// PUT routes
router.put('/staff/updateStaffUser/:staffId', updateStaffUser);
router.put('/staff/updateStaffUserPassword/:staffId', updateStaffUserPassword);

// GET routes
router.get('/staff/getStaffUserById/:staffId', getStaffUserById);

// Export router
module.exports = {
    routes: router
}