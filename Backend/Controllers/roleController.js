"use strict";

// Import methods
const firebase = require("../Config/firebaseDbInit");
const {v4: uuidv4} = require("uuid");
//const RoleSchema = require("../Models/roleModels");
const {parseISO} = require("date-fns");



// Add a new role to the role collection
const addRole = async (req, res, next) => {
    try {
        // Checking to see if the role already exists
        // If role exists for the business, return an error
        const role = await firebase
            .collection("Roles")
            .where("role", "==", req.body.role)
            .where("companyId", "==", req.params.companyId)
            .get();

        // The primary key will be assigned to roleId
        const primary_key = "role_" + uuidv4();

        if (role.empty) {
            // Add the role to the Roles collection
            await firebase
                .collection("Roles")
                .doc(primary_key)
                .set({
                    roleId: primary_key,
                    companyId: req.params.companyId,
                    role: req.body.role,
                    createdAt: parseISO(new Date().toISOString()),
                    updatedAt: parseISO(new Date().toISOString()),
                });
            // Send success message to the client
            res.json({
                status: "success",
                message: "Role added successfully",
            });
        } else {
            // Send error message to the client
            res.json({
                status: "error",
                error: "Role already exists",
                message: "Role already exists",
            });
        }
    } catch (error) {
        next(error);
    }
};



// Get all roles associated with a business id
const getRolesByBusinessId = async (req, res, next) => {
    try {
        const roles = await firebase
            .collection("Roles")
            .where("companyId", "==", req.params.companyId)
            .get();
        const rolesArray = roles.docs.map((role) => {
            return {
                roleId: role.data().roleId,
                role: role.data().role,
            };
        });
        res.send(rolesArray);
    } catch (error) {
        next(error);
    }
};



// Function to allow a business to update a role on the table
const updateRole = async (req, res, next) => {
    try {
        // Get the role from the Roles collection
        const role = await firebase
            .collection("Roles")
            .doc(req.params.roleId)
            .get();
        if (role.empty) {
            // Send error message if role does not exist
            res.json({
                status: "error",
                error: "Role does not exist",
                message: "Role does not exist",
            });
        } else {
            // Update the role in the Roles collection
            await firebase
                .collection("Roles")
                .doc(req.params.roleId)
                .update({
                    role: req.body.role,
                    updatedAt: parseISO(new Date().toISOString()),
                });
            // Send success message
            res.json({
                status: "success",
                message: "Role updated successfully",
            });
        }
    } catch (error) {
        next(error);
    }
};



// Function to allow a business to delete a role
const deleteRole = async (req, res, next) => {
    try {
        // Get the role
        const role = await firebase
            .collection("Roles")
            .doc(req.params.roleId)
            .get();
        // Delete the role
        await firebase.collection("Roles").doc(req.params.roleId).delete();
        res.json({
            status: "success",
            message: "Role deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};



//Export methods
module.exports = {
    addRole,
    getRolesByBusinessId,
    updateRole,
    deleteRole,
};