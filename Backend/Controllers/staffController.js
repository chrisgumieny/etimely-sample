'use strict';

// Import methods
const firebase = require('../Config/firebaseDbInit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Function to verify the staff user email is verified
const verifyStaff = async (req, res, next) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const staff = await firebase.collection('StaffUser').where('staffEmail', '==', decodedToken.staffEmail).get();
        if (staff.empty) {
            res.json({
                status: 'error',
                message: 'Staff user does not exist'
            })
        } else {
            await firebase.collection('StaffUser').doc(staff.docs[0].id).update({
                isVerified: true
            });
            res.json({
                status: 'success',
                message: 'Staff account verified successfully'
            })
        }
    } catch (error) {
        next(error);
    }
}




// Function to update staff user details in profile using staff user id
const updateStaffUser = async (req, res, next) => {
    try {
        // Update staff by staffId
        const staffId = req.params.staffId;
        const staff = await firebase.collection('StaffUser').doc(staffId).get();
        if (staff.empty) {
            res.json({
                status: 'error',
                message: 'Staff user does not exist'
            })
        } else {

            await firebase.collection('StaffUser').doc(staffId).update({
                staffFirstName: req.body.staffFirstName,
                staffLastName: req.body.staffLastName,
            });
            res.json({
                status: 'success',
                message: 'Staff user details updated successfully'
            })
        }
    } catch (error) {
        next(error);
    }
}


// Function to allow a staff user to change their password by entering their old password
const updateStaffUserPassword = async (req, res, next) => {
    try {
        // Update staff by staffId
        const staffId = req.params.staffId;
        const staff = await firebase
            .collection('StaffUser')
            .doc(staffId)
            .get();

        // Allow user to enter their old password and see if it matches the password in the database
        const oldPassword = req.body.oldPassword;
        const hashedPassword = staff.data().password;
        const isMatch = await bcrypt.compare(oldPassword, hashedPassword);

        if (staff.empty) {
            res.json({
                status: 'error',
                error: 'Staff user does not exist',
                message: 'Staff user does not exist',
            });
        } else if (isMatch) {
            const newPassword = req.body.newPassword;
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            // If the old password matches the password in the database, allow user to change their password
            await firebase.collection("StaffUser").doc(staffId).update({
                password: hashedNewPassword,
            });
            // Send success message
            res.json({
                status: "success",
                message: "Staff user password updated successfully",
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




// Function to get a specific staff user by id
const getStaffUserById = async (req, res, next) => {
    try {

        // Get staff user by staffId
        const staff = await firebase.collection('StaffUser').where('staffId', '==', req.params.staffId).get();
        // get all roles from the Roles collection
        const roles = await firebase.collection('Roles').get();
        // loop through all roles and get the roleId and roleName and compare it to the roleId in the StaffUser collection and return the roleName
        const rolesArray = roles.docs.map(roles => {
            return {
                roleId: roles.id,
                role: roles.data().role
            }
        });


        // Map through the staff array and get the roleId and compare it to the rolesArray and return the roleName
        const staffUserArray = staff.docs.map(staff => {
            return {
                staffId: staff.id,
                companyName: staff.data().companyName,
                staffEmail: staff.data().staffEmail,
                staffFirstName: staff.data().staffFirstName,
                staffLastName: staff.data().staffLastName,
                roleId: staff.data().roleId ? rolesArray.filter(roles => roles.roleId === staff.data().roleId)[0].role : '',
                accountStatus: staff.data().accountStatus
            }
        });

        // Unnest the array
        const staffUser = staffUserArray[0];
        // Send staff user details to the client
        res.send(staffUser);
    } catch (error) {
        next(error);
    }
}



// export all the functions
module.exports = {
    verifyStaff,
    updateStaffUser,
    updateStaffUserPassword,
    getStaffUserById,
};