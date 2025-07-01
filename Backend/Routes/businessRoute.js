// Import methods
const express = require('express');
const { 
    registerBusiness, 
    verifyBusiness,
    generateInviteLink,
    verifyInviteLink,
    getAllStaff,
    getBusinessStaffById,
    searchStaff,
    terminateStaff,
    updateStaff,
    updateBusinessUser,
    updateBusinessUserPassword,
    getBusinessUserById,
    filterStaff,
} = require('../Controllers/businessController');
const {loginBusiness} = require('../Controllers/loginController');
const {updatePasswordPost} = require('../Controllers/updatePasswordController');
const {resetPasswordPost} = require('../Controllers/resetPasswordController');


// Create router
const router = express.Router();


// Create routes api endpoints
// POST routes
router.post('/business/register', registerBusiness); // Endpoint to register business
router.post('/login', loginBusiness); // Endpoint to login business
router.post('/business/filterStaff/:companyId', filterStaff); // Endpoint filter staff
router.post('/business/generateInviteLink', generateInviteLink); // Endpoint generate invite link
router.post('/business/verifyInviteLink/:token', verifyInviteLink); // Endpoint verify invite link
router.post('/business/searchStaff/:companyId/:search', searchStaff); // Endpoint to search staff


// PUT routes
router.put('/updatePasswordPost/:token', updatePasswordPost); // Endpoint to update password
router.put('/resetPasswordPost', resetPasswordPost); // Endpoint to reset password
router.put('/business/updateStaff/:staffId', updateStaff); // Update staff
router.put('/business/updateBusinessUser/:businessId', updateBusinessUser); // Update business user
router.put('/business/updateBusinessUserPassword/:businessId', updateBusinessUserPassword); // Update business user password

// DELETE routes
router.delete('/business/terminateStaff/:staffId', terminateStaff); // Terminate staff


// GET routes
router.get('/business/verify/:token', verifyBusiness); // Endpoint to verify business
router.get('/business/staff/:companyName', getAllStaff); // Endpoint to get all staff for a business
router.get('/business/getstaffByCompanyId/:companyId', getBusinessStaffById); // Endpoint to get staff by companyId
router.get('/business/getBusinessUserById/:businessId', getBusinessUserById);// Endpoint to get business user by id


// Export router
module.exports = {
    routes: router
}