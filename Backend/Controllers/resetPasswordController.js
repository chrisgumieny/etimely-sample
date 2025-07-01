"use strict";

// Import methods
const firebase = require("../Config/firebaseDbInit");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
require("dotenv").config();
const {resetPasswordEmail} = require("../Utils/EmailTemplate");



// Function to send a one time reset password link to user requesting to change their password.
const resetPasswordPost = async (req, res, next) => {
    // Compare the email with the email in the BusinessUser collection and staffUser collection
    try {
        const business = await firebase
            .collection("BusinessUser")
            .where("companyEmail", "==", req.body.companyEmail)
            .get();
        if (business.empty) {
            const staff = await firebase
                .collection("StaffUser")
                .where("staffEmail", "==", req.body.companyEmail)
                .get();
            if (staff.empty) {
                res.json({
                    status: "error",
                    error: "Account does not exist",
                    message: "Account does not exist",
                });
            } else {
                // Generate a token
                const token = jwt.sign({
                        id: staff.docs[0].id
                    },
                    process.env.JWT_SECRET, {
                        expiresIn: "1h"
                    }
                );


                // Update the token in the StaffUser collection
                await firebase.collection("StaffUser").doc(staff.docs[0].id).update({
                    resetPasswordToken: token,
                });
                // Send the invite token to the staff user's email
                const transporter = nodeMailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: req.body.companyEmail,
                    subject: "Password Reset",
                    html: resetPasswordEmail(token),
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({
                            status: "success",
                            message: "Email sent successfully",
                        });
                    }
                });
            }
        } else {
            // Generate a token
            const token = jwt.sign({
                    id: business.docs[0].id
                },
                process.env.JWT_SECRET, {
                    expiresIn: "1h"
                }
            );



            // Update the token in the BusinessUser collection
            await firebase
                .collection("BusinessUser")
                .doc(business.docs[0].id)
                .update({
                    resetPasswordToken: token,
                });
            // Send the token to the business user's email
            const transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.companyEmail,
                subject: "Password Reset",

                html: resetPasswordEmail(token),
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        status: "success",
                        message: "Email sent successfully",
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    resetPasswordPost,
};