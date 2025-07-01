// Import methods
const express = require('express');
const { 
    addSchedule, 
    getSchedulesByStaffId, 
    deleteSchedule, 
    updateSchedule, 
    getSchedulesByRole 
} = require('../Controllers/scheduleController');

// Create router
const router = express.Router();

// Create routes api endpoints
// ADD Schedule
router.post('/schedule/add', addSchedule);

// GET schedules by staff ID
router.get('/schedule/getSchedulesByStaffId/:staffId', getSchedulesByStaffId);

// GET schedules by role
router.get('/schedule/getSchedulesByRole/:roleId', getSchedulesByRole);

// DELETE by schedule ID
router.delete('/schedule/:scheduleId', deleteSchedule);

// UPDATE schedule
router.post('/schedule/update', updateSchedule);

// Export router
module.exports = {
    routes: router
}