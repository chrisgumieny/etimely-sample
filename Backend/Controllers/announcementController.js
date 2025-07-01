'use strict';

// Import methods
const firebase = require('../Config/firebaseDbInit');
//const AnnouncementSchema = require('../Models/announcementModels');
const { v4: uuidv4 } = require('uuid');


const addAnnouncement = async (req, res, next) => {

    try {
        const primary_key = "announcement_" + uuidv4();
        await firebase.collection('Announcement').doc(primary_key).set({
            announcementId: primary_key,
            companyId: req.params.companyId,
            title: req.body.title,
            details: req.body.details,
            createdAt: new Date().toISOString()
        });
        res.json({
            status: 'success',
            message: 'New announcement created'
        })

    }
    catch (error) {
        next(error);
    }
}

const getAnnouncement = async (req, res, next) => {
    try {
        const announcement = await firebase.collection('Announcement').where('companyId', '==', req.params.companyId).get();
        const announcementArray = announcement.docs.map(announcement => {
            return {
                announcementId: announcement.data().announcementId,
                title: announcement.data().title,
                details: announcement.data().details,
                createdAt: announcement.data().createdAt,
            }
        });
        res.send(announcementArray);
    }
    catch (error) {
        next(error);
    }
}


const deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await firebase.collection('Announcement').doc(req.params.announcementId).get();
        await firebase.collection('Announcement').doc(req.params.announcementId).delete();
        res.json({
            status: 'success',
            message: 'Announcement deleted '
        })
    }
    catch (error) {
        next(error);
    }
}


module.exports = {
    addAnnouncement,
    getAnnouncement,
    deleteAnnouncement,
};