// Import methods
const express = require('express');
const {
    addRole, 
    getRolesByBusinessId, 
    updateRole, 
    deleteRole
} = require('../Controllers/roleController');

// Create router
const router = express.Router();

// Create routes api endpoints
// ADD Role
router.post('/role/add/:companyId', addRole);

// GET roles by business ID
router.get('/role/getRolesByBusinessId/:companyId', getRolesByBusinessId);

// UPDATE Role
router.put('/role/update/:roleId', updateRole);

// DELETE Role
router.delete('/role/delete/:roleId', deleteRole);

// Export router
module.exports = {
    routes: router
}