"use strict";

// Import methods
const firebase = require("../Config/firebaseDbInit");
const nodeMailer = require("nodemailer");
const {
    v4: uuidv4
} = require("uuid");
//const ContactUsSchema = require('../Models/contactUsModels');
const {
    parseISO
} = require("date-fns");
const {
    contactUsTemplate
} = require("../Utils/EmailTemplate");



// Add a new contact us to the contactUs collection
const addContactUs = async (req, res, next) => {
    try {
        // Checking to see if the contact us already exists

        // The primary key will be assigned to contactUsId
        const primary_key = "contactUs_" + uuidv4();

        // Add the contact us to the ContactUs collection
        await firebase
            .collection("ContactUs")
            .doc(primary_key)
            .set({
                contactUsId: primary_key,
                name: req.body.name,
                email: req.body.email,
                message: req.body.message,
                createdAt: parseISO(new Date().toISOString()),
            });
        // Success message
        res.json({
            status: "success",
            message: "Contact us added successfully",
        });

        // Send email to the etimely owner
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: req.body.email,
            to: process.env.EMAIL_USER,
            subject: "New contact us message",
            html: contactUsTemplate(req.body.name, req.body.email, req.body.message),
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // send success message to the client
                res.json({
                    status: "success",
                    message: "Contact us added successfully",
                });
            }
        });
    } catch (error) {
        next(error);
    }
};



// Export methods
module.exports = {
    addContactUs,
};