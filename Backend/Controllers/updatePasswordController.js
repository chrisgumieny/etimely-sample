'use strict';

// Import methods
const firebase = require('../Config/firebaseDbInit');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
require("dotenv").config()



// Endpoint: POST /reset/:token
const updatePasswordPost = async (req, res, next) => {

    const token = req.params.token;

    try {

        const business = await firebase.collection('BusinessUser').where('resetPasswordToken', '==', token).get();
        const staff = await firebase.collection('StaffUser').where('resetPasswordToken', '==', token).get();
        if (business.empty && staff.empty) {
            res.json({
                status: 'error',
                error: 'Account does not exist',
                message: 'Account does not exist'
            })
        }

        // Validate the token using jwt and compare the token with the token in the business or staff collection
        // First update staff user
        if (!business.empty) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await firebase.collection('BusinessUser').doc(business.docs[0].id).update({
                password: hashedPassword,
                resetPasswordToken: ''
            });

            // Send email to the business user
            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: business.docs[0].data().companyEmail,
                subject: 'Password reset successful',
                text: `Your password has been reset successfully.`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.json({
                        status: 'error',
                        error: error,
                        message: 'Password reset failed'
                    })
                } else {
                    res.json({
                        status: 'success',
                        message: 'Password reset successful'
                    })
                }
            }
            );
        }


        // Then update staff user
        if (!staff.empty) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await firebase.collection('StaffUser').doc(staff.docs[0].id).update({
                password: hashedPassword,
                resetPasswordToken: ''
            });
        }

    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    updatePasswordPost
};