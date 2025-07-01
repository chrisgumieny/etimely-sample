"use strict";

// Import methods
const firebase = require("../Config/firebaseDbInit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
//const BusinessSchema = require('../Models/businessModels');
const {verifyEmail, invteStaffEmail} = require("../Utils/EmailTemplate");
const {v4: uuidv4} = require("uuid");



// Function to add a new business credential to the BusinessUser collection
const registerBusiness = async (req, res, next) => {
    // Compare BusinessUser and StaffUser collection and check if email already exists in both collections
    try {
        // Get Business User collection
        const business = await firebase
            .collection("BusinessUser")
            .where("companyEmail", "==", req.body.companyEmail)
            .get();

        // Get Staff User collection
        const staff = await firebase
            .collection("StaffUser")
            .where("staffEmail", "==", req.body.companyEmail)
            .get();
        // Create a unique primary key for the business user
        const primary_key = "business_" + uuidv4();

        // First check if the email already exists in the BusinessUser collection and StaffUser collection

        if (business.empty && staff.empty) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Use generated id as primary key
            await firebase.collection("BusinessUser").doc(primary_key).set({
                // set companyId to generated id from collection
                companyId: primary_key,
                companyName: req.body.companyName,
                companyEmail: req.body.companyEmail,
                password: hashedPassword,
                isVerified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Send success message to client
            res.json({
                status: "success",
                message: "Business account created successfully",
            });

            // When a new business creates an account,
            // create 5 default roles for the business and add to the Roles collection and add the companyId to the Roles collection for thoses roles

            // Create a unique primary key for 5 default roles
            const role_1 = "role_" + uuidv4();
            const role_2 = "role_" + uuidv4();
            const role_3 = "role_" + uuidv4();
            const role_4 = "role_" + uuidv4();
            const role_5 = "role_" + uuidv4();

            // Create 5 default roles for the business
            await firebase.collection("Roles").doc(role_1).set({
                roleId: role_1,
                role: "Cashier",
                companyId: primary_key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            await firebase.collection("Roles").doc(role_2).set({
                roleId: role_2,
                role: "Manager",
                companyId: primary_key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            await firebase.collection("Roles").doc(role_3).set({
                roleId: role_3,
                role: "Sales Associate",
                companyId: primary_key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            await firebase.collection("Roles").doc(role_4).set({
                roleId: role_4,
                role: "Tech Support",
                companyId: primary_key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            await firebase.collection("Roles").doc(role_5).set({
                roleId: role_5,
                role: "Customer Service",
                companyId: primary_key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Generate a verification token and send an email to the business user
            const token = jwt.sign({
                    companyEmail: req.body.companyEmail,
                },
                process.env.JWT_KEY, {
                    expiresIn: "24h",
                }
            );

            // Send verification email to the business user
            const transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            // Send verification email to the business user
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.companyEmail,
                subject: "Verify Account",
                html: verifyEmail(token),
            };
            // Send email using the transporter and mailOptions
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    // Send success message to client
                    res.json({
                        status: "success",
                        message: "Email sent successfully",
                    });
                }
            });
        } else {
            // If the email already exists in the BusinessUser collection and Staff collection, send error message to client
            res.json({
                status: "error",
                error: "Account already exists",
                message: "Account already exists",
            });
        }
    } catch (error) {
        next(error);
    }
};



// Function for business to generate an invite link that expires in 24 hours
const generateInviteLink = async (req, res, next) => {
    try {
        const business = await firebase.collection('BusinessUser').where('companyEmail', '==', req.body.staffEmail).get();
        const staff = await firebase.collection('StaffUser').where('staffEmail', '==', req.body.staffEmail).get();

        if (business.empty && staff.empty) {
            // get companyId from business trying to generate invite link
            const companyId = await firebase.collection("BusinessUser").where("companyId", "==", req.body.companyId).get();

            // Map through the companyId and get the companyId
            const companyIdArray = companyId.docs.map((companyId) => {
                return {
                    companyId: companyId.id,
                };
            });

            // Map through the companyIdArray and get the companyName
            const companyNameArray = companyId.docs.map((companyId) => {
                return {
                    companyName: companyId.data().companyName,
                };
            });

            // Create temporary password for a staff user till they register
            const temp_password = "Test12347883";
            // Hash the temporary password
            const hashedPassword = await bcrypt.hash(temp_password, 10);

            // Create signed JWT token for the staff user. This will be used to verify the staff user in the verifyStaffUser function
            const token = jwt.sign({
                companyName: companyNameArray[0].companyName,
                companyId: companyIdArray[0].companyId,
                staffEmail: req.body.staffEmail,
                staffFirstName: req.body.staffFirstName,
                staffLastName: req.body.staffLastName,
                roleId: req.body.roleId,
                accountStatus: "Pending",
            },
                process.env.JWT_KEY, {
                expiresIn: "24h",
            }
            );

            // Add staff user to the StaffUser collection and set accountStatus to pending
            const primary_key = "staff_" + uuidv4();
            await firebase.collection("StaffUser").doc(primary_key).set({
                // set companyId to generated id from collection
                staffId: primary_key,
                companyName: companyNameArray[0].companyName,
                companyId: companyIdArray[0].companyId,
                staffEmail: req.body.staffEmail,
                staffFirstName: req.body.staffFirstName,
                staffLastName: req.body.staffLastName,
                roleId: req.body.roleId,
                password: hashedPassword,
                accountStatus: "Pending",
            });

            // Send invitation email to the staff user
            const transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            // Send invitation contents in the email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.staffEmail,
                subject: "Invitation to join " + companyNameArray[0].companyName,
                html: invteStaffEmail(
                    token,
                    req.body.staffFirstName,
                    req.body.staffLastName,
                    companyNameArray[0].companyName,
                    req.body.staffEmail
                ),
            };
            // Send email using the transporter and mailOptions
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    // Send success message to client
                    res.json({
                        status: "success",
                        message: "Email sent successfully",
                    });
                }
            });
        }

        else {
            //res.send('Business user already exists');
            res.json({
                status: 'error',
                error: 'Account already exists',
                message: 'Account already exists'
            })
        }
    }
    catch (error) {
        next(error);
    }
};



// Function to verify invitation link and allow staff to sign up
const verifyInviteLink = async (req, res, next) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // Get staff from decoded JWT token
        const staff = await firebase
            .collection("StaffUser")
            .where("staffEmail", "==", decoded.staffEmail)
            .get();

        // Hash staff user password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Get the staffId of the new staff user and use that update the password and account status
        const staffId = staff.docs.map((staff) => {
            return {
                staffId: staff.id,
            };
        });

        // Update the staff user password and change account status to active
        await firebase.collection("StaffUser").doc(staffId[0].staffId).update({
            roleId: decoded.roleId,
            password: hashedPassword,
            accountStatus: "Active",
        });

        // Send success message to client
        res.json({
            status: "success",
            message: "Staff account created successfully",
        });
    } catch (error) {
        next(error);
    }
};



// Get all staff users associated with a business
// currently is getting by business name. NOT GOOD
const getAllStaff = async (req, res, next) => {
    try {
        const staff = await firebase
            .collection("StaffUser")
            .where("companyName", "==", req.params.companyName)
            .get();
        const staffUserArray = staff.docs.map((staff) => {
            return {
                staffId: staff.id,
                companyName: staff.data().companyName,
                staffEmail: staff.data().staffEmail,
                staffFirstName: staff.data().staffFirstName,
                staffLastName: staff.data().staffLastName,
                accountStatus: staff.data().accountStatus,
                createdAt: staff.data().createdAt,
                updatedAt: staff.data().updatedAt,
            };
        });
        res.send(staffUserArray);
    } catch (error) {
        next(error);
    }
};



// Get all staff users associated with a business by id
const getBusinessStaffById = async (req, res, next) => {
    try {
        const staff = await firebase.collection('StaffUser').where('companyId', '==', req.params.companyId).get();
        // get all roles from the Roles collection
        const roles = await firebase.collection('Roles').get();
        // loop through all roles and get the roleId and roleName and compare it to the roleId in the StaffUser collection and return the roleName
        const rolesArray = roles.docs.map(roles => {
            return {
                roleId: roles.id,
                role: roles.data().role
            }
        });



        const staffUserArray = staff.docs.map(staff => {
            return {
                staffId: staff.id,
                companyName: staff.data().companyName,
                staffEmail: staff.data().staffEmail,
                staffFirstName: staff.data().staffFirstName,
                staffLastName: staff.data().staffLastName,
                accountStatus: staff.data().accountStatus,
                createdAt: staff.data().createdAt,
                updatedAt: staff.data().updatedAt,
                role: staff.data().roleId,
                roleName: staff.data().roleId ? rolesArray.filter(roles => roles.roleId === staff.data().roleId)[0].role : '',
                accountStatus: staff.data().accountStatus
            }
        });
        res.send(staffUserArray);
    }
    catch (error) {
        next(error);
    }
}



// Function to verify if a business user email is verified
const verifyBusiness = async (req, res, next) => {
    try {
        // Once user clicks the verification link, verify the user by setting isVerified to true
        const token = req.params.token;
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const business = await firebase
            .collection("BusinessUser")
            .where("companyEmail", "==", decodedToken.companyEmail)
            .get();
        if (business.empty) {
            // Show error if business user does not exist
            res.json({
                status: "error",
                error: "Business account does not exist",
                message: "Business account does not exist",
            });
        } else {
            // Update the isVerified field to true
            await firebase
                .collection("BusinessUser")
                .doc(business.docs[0].id)
                .update({
                    isVerified: true,
                });
            // If business account verification succeeds, send success message
            res.json({
                status: "success",
                message: "Business account verified successfully",
            });
        }
    } catch (error) {
        next(error);
    }
};



// Function to allow a business user to search for a staff first name, last name or email using the search bar
const searchStaff = async (req, res, next) => {
    try {
        const getStaffFirstName = await firebase
            .collection("StaffUser")
            .where("companyId", "==", req.params.companyId)
            .where("staffFirstName", "==", req.params.search)
            .get();
        const getStaffLastName = await firebase
            .collection("StaffUser")
            .where("companyId", "==", req.params.companyId)
            .where("staffLastName", "==", req.params.search)
            .get();
        const getStaffEmail = await firebase
            .collection("StaffUser")
            .where("companyId", "==", req.params.companyId)
            .where("staffEmail", "==", req.params.search)
            .get();

        const staffUserArray = getStaffFirstName.docs.map((staff) => {
            return {
                staffId: staff.id,
                companyName: staff.data().companyName,
                staffEmail: staff.data().staffEmail,
                staffFirstName: staff.data().staffFirstName,
                staffLastName: staff.data().staffLastName,
            };
        });

        const staffUserArray2 = getStaffLastName.docs.map((staff) => {
            return {
                staffId: staff.id,
                companyName: staff.data().companyName,
                staffEmail: staff.data().staffEmail,
                staffFirstName: staff.data().staffFirstName,
                staffLastName: staff.data().staffLastName,
            };
        });

        const staffUserArray3 = getStaffEmail.docs.map((staff) => {
            return {
                staffId: staff.id,
                companyName: staff.data().companyName,
                staffEmail: staff.data().staffEmail,
                staffFirstName: staff.data().staffFirstName,
                staffLastName: staff.data().staffLastName,
            };
        });
        res.send(staffUserArray.concat(staffUserArray2).concat(staffUserArray3));
    } catch (error) {
        next(error);
    }
};

// Function to allow user to filter staff users by role type
const filterStaff = async (req, res, next) => {
    try {
        const staff = await firebase.collection('StaffUser').where('companyId', '==', req.params.companyId).where('staffRoleType', '==', req.params.staffRoleType).get();
        const staffUserArray = staff.docs.map(staff => {
            return {
                staffId: staff.id,
                companyName: staff.data().companyName,
                staffEmail: staff.data().staffEmail,
                staffFirstName: staff.data().staffFirstName,
                staffLastName: staff.data().staffLastName,
                staffRoleType: staff.data().staffRoleType,
                accountStatus: staff.data().accountStatus,
                createdAt: staff.data().createdAt,
                updatedAt: staff.data().updatedAt
            }
        });
        res.send(staffUserArray);
    }
    catch (error) {
        next(error);
    }
}



// Function to delete a business user
const deleteBusiness = async (req, res, next) => {
    try {
        // Get the business user
        const business = await firebase.collection('BusinessUser').doc(req.params.id).get();
        // Delete the business user
        await firebase.collection('BusinessUser').doc(req.params.id).delete();
        // If deletion is successful, send success message
        res.json({
            status: 'success',
            message: 'Business user deleted successfully'
        })
    }
    catch (error) {
        next(error);
    }
}



// Function to terminate a staff user, remove the staff user from the database
const terminateStaff = async (req, res, next) => {
    try {
        const staffId = req.params.staffId;
        const allCollection = ["StaffUser", "Schedules", "Availability"];

        // When a staff user is terminated, delete all the staff user's data from the database and in all collections
        for (let i = 0; i < allCollection.length; i++) {
            await firebase
                .collection(allCollection[i])
                .where("staffId", "==", staffId)
                .get()
                .then(async (snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
        }
        res.send({
            status: "success",
            message: "Staff user deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};



// Function to allow a business user to update a staff information on the table
const updateStaff = async (req, res, next) => {
    try {
        const staffId = req.params.staffId;
        const staff = await firebase.collection("StaffUser").doc(staffId).get();
        if (staff.empty) {
            // If staff user does not exist, show error
            res.json({
                status: "error",
                error: "Staff user does not exist",
                message: "Staff user does not exist",
            });
        } else {
            // Update the staff user
            await firebase.collection("StaffUser").doc(staffId).update({
                staffFirstName: req.body.staffFirstName,
                staffLastName: req.body.staffLastName,
                staffEmail: req.body.staffEmail,
                roleId: req.body.roleId,
            });
            // Show success message
            res.json({
                status: "success",
                message: "Staff user updated successfully",
            });
        }
    } catch (error) {
        next(error);
    }
};

// Function to update business user details in profile using business user id
const updateBusinessUser = async (req, res, next) => {
    try {
        // Update business by businessId
        const businessId = req.params.businessId;
        const business = await firebase
            .collection("BusinessUser")
            .doc(businessId)
            .get();

        if (business.empty) {
            // If business user doesn't exist, send error message
            res.json({
                status: "error",
                error: "Business user does not exist",
                message: "Business user does not exist",
            });
        } else {
            await firebase.collection("BusinessUser").doc(businessId).update({
                companyName: req.body.companyName,
            });
            // Send success message
            res.json({
                status: "success",
                message: "Business user updated successfully",
            });
        }
    } catch (error) {
        next(error);
    }
};


// Function to allow a business user to change their password by entering the old password
const updateBusinessUserPassword = async (req, res, next) => {
    try {
        // Update business by businessId
        const businessId = req.params.businessId;
        const business = await firebase
            .collection("BusinessUser")
            .doc(businessId)
            .get();

        // Allow user to enter their old password and see if it matches the password in the database
        const oldPassword = req.body.oldPassword;
        const hashedPassword = business.data().password;
        const isMatch = await bcrypt.compare(oldPassword, hashedPassword);


        if (business.empty) {
            // If business user doesn't exist, send error message
            res.json({
                status: "error",
                error: "Business user does not exist",
                message: "Business user does not exist",
            });
        } else if (isMatch) {
            const newPassword = req.body.newPassword;
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            // If the old password matches the password in the database, allow user to change their password
            await firebase.collection("BusinessUser").doc(businessId).update({
                password: hashedNewPassword,
            });
            // Send success message
            res.json({
                status: "success",
                message: "Business user password updated successfully",
            });
        } else {
            // If the old password does not match the password in the database, show error
            res.json({
                status: "error",
                error: "Old password does not match",
                message: "Old password does not match",
            });
        }

    }
    catch (error) {
        next(error);
    }
};




// Function to get business by businessId
const getBusinessUserById = async (req, res, next) => {
    try {
        // Get the business user
        const businessId = req.params.businessId;
        const business = await firebase
            .collection("BusinessUser")
            .doc(businessId)
            .get();

        if (business.empty) {
            // if business user does not exist, show error
            res.json({
                status: "error",
                error: "Business user does not exist",
            });
        } else {
            // Send the business user
            res.send(business.data());
        }
    } catch (error) {
        next(error);
    }
};

// export all the functions
module.exports = {
    registerBusiness,
    verifyBusiness,
    generateInviteLink,
    verifyInviteLink,
    getAllStaff,
    getBusinessStaffById,
    searchStaff,
    deleteBusiness,
    terminateStaff,
    updateStaff,
    updateBusinessUser,
    updateBusinessUserPassword,
    getBusinessUserById,
    filterStaff,
};