// Import method
const express = require('express');
const {
    addAnnouncement, 
    getAnnouncement, 
    deleteAnnouncement
} = require('../Controllers/announcementController');

// Creates router
const router = express.Router();

// Creates api endpoints
// Add announcement
router.post('/announcement/addAnnouncement/:companyId', addAnnouncement);

// Get announcements
router.get('/announcement/getAnnouncement/:companyId', getAnnouncement);

// Delete announcement
router.delete('/announcement/deleteAnnouncement/:announcementId', deleteAnnouncement);

// Exports router
module.exports = {
    routes: router
}