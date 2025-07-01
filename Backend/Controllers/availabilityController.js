'use strict';

// Import methods
const firebase = require('../Config/firebaseDbInit');
//const AvailabilitySchema = require('../Models/availabilityModels');
const { v4: uuidv4 } = require('uuid');
const { parseISO } = require('date-fns');

const addAvailability = async (req, res, next) => {

    try {
        const staff = await firebase.collection('Availability').doc(req.params.staffId).get();
        const primary_key = "availability_" + uuidv4();

        await firebase.collection('Availability').doc(primary_key).set({
            availabilityId: primary_key,
            staffId: req.params.staffId,
            startTime: req.body.start,
            endTime: req.body.end,
            createdAt: parseISO(new Date().toISOString()),
            updatedAt: parseISO(new Date().toISOString()),
            isApproved: false
        })
        res.json({
            status: 'success',
            message: "Availability created successfully"
        })

    }
    catch (error) {
        next(error);
    }
}

const getAvailability = async (req, res, next) => {
    try {
        // Orders availabilities by descending start time
        const availability = await firebase.collection('Availability').orderBy('startTime', 'desc').where('staffId', '==', req.params.staffId).get();
        const availabilityArray = availability.docs.map(availability => {
            return {
                event_id: availability.data().availabilityId,
                startTime: availability.data().startTime,
                endTime: availability.data().endTime,
                isApproved: availability.data().isApproved,
            }
        });
        res.send(availabilityArray);
    }
    catch (error) {
        next(error);
    }
}

const updateAvailability = async (req, res, next) => {
    try {
        const availability = await firebase.collection('Availability').doc(req.body.availabilityId).get();
        if (availability.empty) {
            res.json({
                status: 'error',
                error: 'No availability to display',
                message: 'No availability to display'
            })
        }
        else {
            await firebase.collection('Availability').doc(req.body.event_id).update({
                startTime: req.body.start,
                endTime: req.body.end,
                updatedAt: parseISO(new Date().toISOString())
            });
            res.json({
                status: 'success',
                message: 'Availability updated'
            })
        }
    }
    catch (error) {
        next(error);
    }
}

const verifyAvailability = async (req, res, next) => {
    try {

        const availability = await firebase.collection('Availability').doc(req.params.availabilityId).get();
        if (availability.empty) {
            res.json({
                status: 'error',
                error: 'No availability to display',
                message: 'No availability to display'
            })
        }
        else {
            await firebase.collection('Availability').doc(req.params.availabilityId).update({
                updatedAt: parseISO(new Date().toISOString()),
                isApproved: true
            });
            res.json({
                status: 'success',
                message: 'Availability verified'
            })
        }
    }
    catch (error) {
        next(error);
    }
}



const deleteAvailability = async (req, res, next) => {
    try {
        const availability = await firebase.collection('Availability').doc(req.params.availabilityId).get();
        await firebase.collection('Availability').doc(req.params.availabilityId).delete();
        res.json({
            status: 'success',
            message: 'Availability deleted'
        })
    }
    catch (error) {
        next(error);
    }
}


module.exports = {
    addAvailability,
    getAvailability,
    updateAvailability,
    deleteAvailability,
    verifyAvailability,
};