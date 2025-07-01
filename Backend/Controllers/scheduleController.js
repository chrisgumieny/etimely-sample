'use strict';

// Import methods
const firebase = require('../Config/firebaseDbInit');
const { v4: uuidv4 } = require('uuid');
//const ScheduleSchema = require('../Models/scheduleModels');
const { parseISO } = require('date-fns');


// Add a new shift to the schedules collection
const addSchedule = async (req, res, next) => {

    try {
        // Checking to see if the schedule already exists
        const schedule = await firebase.collection('Schedules').where('staffId', '==', req.body.staffId).
        where('scheduleStartTime', '==', req.body.start).where('scheduleEndTime', '==', req.body.end).get();

        // The primary key will be assigned to scheduleId
        const primary_key = "schedule_" + uuidv4();

        if (schedule.empty) {
            // Add the shift to the Schedule collection
            await firebase.collection('Schedules').doc(primary_key).set({
                scheduleId: primary_key,
                staffId: req.body.staffId,
                scheduleRole: req.body.role,
                scheduleStartTime: req.body.start,
                scheduleEndTime: req.body.end,
                createdAt: parseISO(new Date().toISOString()),
                updatedAt: parseISO(new Date().toISOString())
            });
            // Send success message
            res.json({
                status: 'success',
                message: 'Shift added successfully'
            })
        }
        else {
            // Send error message
            res.json({
                status: 'error',
                error: 'Shift already exists',
                message: 'Shift already exists'
            })
        }
    }
    catch (error) {
        next(error);
    }
}

// Get all schedules associated with a staff id
const getSchedulesByStaffId = async (req, res, next) => {
    try {
        const schedule = await firebase.collection('Schedules').where('staffId', '==', req.params.staffId).get();

        const roles = await firebase.collection('Roles').get();

        const rolesArray = roles.docs.map(role => {
            return {
                roleId: role.data().roleId,
                role: role.data().role
            }
        });

        // role is the roleID, roleName is the name for a specified roleID
        const scheduleArray = schedule.docs.map(schedule => {
            return {
                event_id: schedule.data().scheduleId,
                title: schedule.data().staffId,
                role: schedule.data().scheduleRole,
                roleName: rolesArray.filter(roles => roles.roleId === schedule.data().scheduleRole)[0].role,
                start: schedule.data().scheduleStartTime,
                end: schedule.data().scheduleEndTime
            }
        });
        res.send(scheduleArray);
    }
    catch (error) {
        next(error);

    }
}

// Get all schedules associated with a specific roleId
const getSchedulesByRole = async (req, res, next) => {
    try {
        const schedule = await firebase.collection('Schedules').where('scheduleRole', '==', req.params.roleId).get();

        const scheduleArray = schedule.docs.map(schedule => {
            return {
                event_id: schedule.data().scheduleId,
                title: schedule.data().staffId,
                role: schedule.data().scheduleRole,
                start: schedule.data().scheduleStartTime,
                end: schedule.data().scheduleEndTime
            }
        });
        res.send(scheduleArray);
    }
    catch (error) {
        next(error);
    }
}

// Delete a schedule
const deleteSchedule = async (req, res, next) => {
    try {
        // Get the schedule
        const schedule = await firebase.collection('Schedules').doc(req.params.scheduleId).get();
        // Delete the schedule
        await firebase.collection('Schedules').doc(req.params.scheduleId).delete();

        res.json({
            status: 'success',
            message: 'Schedule deleted successfully'
        })
    }
    catch (error) {
        next(error);
    }
}

// Function to update a schedule
const updateSchedule = async (req, res, next) => {
    try {
        // Get the requested schedule to update
        const schedule = await firebase.collection('Schedules').doc(req.body.events_id).get();
        // If schedule does not exist, send an error
        if (schedule.empty) {
            res.json({
                status: 'error',
                error: 'Schedule does not exist',
                message: 'Schedule does not exist'
            })
        }
        else {
            // Update schedule with changes
            await firebase.collection('Schedules').doc(req.body.event_id).update({
                staffId: req.body.staffId,
                scheduleRole: req.body.role,
                scheduleStartTime: req.body.start,
                scheduleEndTime: req.body.end,
                updatedAt: parseISO(new Date().toISOString())
            });
            res.json({
                status: 'success',
                message: 'Schedule updated successfully'
            })
        }
    }
    catch (error) {
        next(error);
    }
}


// export all the functions
module.exports = {
    addSchedule,
    getSchedulesByStaffId,
    deleteSchedule,
    updateSchedule,
    getSchedulesByRole
};
