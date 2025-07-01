"use strict";

// Import methods
const firebase = require("../Config/firebaseDbInit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Allow a business to login
const loginBusiness = async (req, res, next) => {
    try {
        // Check if login credentials are a BusinessUser or StaffUser
        const business = await firebase
            .collection("BusinessUser")
            .where("companyEmail", "==", req.body.companyEmail)
            .get();
        const staff = await firebase
            .collection("StaffUser")
            .where("staffEmail", "==", req.body.companyEmail)
            .get();

        // Check if the business or staff account exists
        if (business.empty && staff.empty) {
            res.json({
                status: "error",
                error: "Account does not exist",
                message: "Account does not exist",
            });
        } else {
            // Check if the password is correct for the business or staff account.
            // If correct then redirect to a busiess dashboard or staff dashboard
            // then create a JWT token and send it to the client
            if (business.empty) {
                const userData = staff.docs[0].data();
                const hashedPassword = userData.password;
                const isPasswordValid = await bcrypt.compare(
                    req.body.password,
                    hashedPassword
                );
                if (isPasswordValid) {
                    const token = jwt.sign({
                            staffEmail: userData.staffEmail,
                            id: userData.id,
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "100h",
                        }
                    );

                    res.cookie("tokens", token, {
                        httpOnly: true,
                        // Expires in 30 days
                        maxAge: 1000 * 60 * 60 * 24 * 30,
                    });

                    // Check if staff is verified, if not verified, send an error message
                    if (staff.docs[0].data().isVerified === false) {
                        res.json({
                            status: "error",
                            error: "Account not verified, please check your email for verification link",
                            message: "Account not verified, please check your email for verification link",
                        });
                    }

                    // If staff login is successful, send success message to the client
                    res.json({
                        status: "success",
                        message: "Staff account logged in successfully",
                        token: token,
                        user: userData,
                    });
                }

                // Show error message if password is incorrect
                else {
                    res.json({
                        status: "error",
                        error: "Incorrect password",
                        message: "Incorrect password",
                    });
                }
            } else {
                const userData = business.docs[0].data();
                const hashedPassword = userData.password;
                const isPasswordValid = await bcrypt.compare(
                    req.body.password,
                    hashedPassword
                );
                if (isPasswordValid) {
                    // Create a JWT Access Token
                    const token = jwt.sign({
                            companyEmail: userData.companyEmail,
                            id: userData.id,
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "100h",
                        }
                    );

                    res.cookie("tokens", token, {
                        httpOnly: true,
                        // Expires in 30 days
                        maxAge: 1000 * 60 * 60 * 24 * 30,
                    });

                    // Check if business is verified, if not verified, send an error message
                    if (business.docs[0].data().isVerified === false) {
                        res.json({
                            status: "error",
                            error: "Account not verified, please check your email for verification link",
                            message: "Account not verified, please check your email for verification link",
                        });
                    }

                    res.json({
                        status: "success",
                        message: "Business account logged in successfully",
                        token: token,
                        user: userData,
                    });
                }
                // Check for incorrect password
                else {
                    res.json({
                        status: "error",
                        error: "Incorrect password",
                        message: "Incorrect password",
                    });
                }
            }
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginBusiness,
};