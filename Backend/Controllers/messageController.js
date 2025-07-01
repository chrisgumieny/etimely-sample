
"use strict";

// Import methods
const firebase = require("../Config/firebaseDbInit");
//const BusinessSchema = require('../Models/businessModels');
const {v4: uuidv4} = require("uuid");

// Function for users to create a message
const createMessageByBusiness = async (req, res) => {
    try {
        const primary_key = "message_" + uuidv4();
    
        // Create a new message
        await firebase.collection("Messages").doc(primary_key).set({
            messageId: primary_key,
            companyId: req.params.companyId,
            sender: "business",
            message: req.body.message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        
        // Return success message
        res.json({
            status: "success",
            message: "Message created successfully"
        });

    } catch (error) {
        res.json({
            status: "error",
            message: "Error creating message"
        });
    }
};




// Function to allow staff to send messages
const createMessageByStaff = async (req, res) => {
    try {
        const primary_key = "message_" + uuidv4();

       

        // Create a new message
        await firebase.collection("Messages").doc(primary_key).set({
            messageId: primary_key,
            companyId: req.params.companyId,
            staffId: req.params.staffId,
            sender: "staff",
            message: req.body.message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Return success message
        res.json({
            status: "success",
            message: "Message created successfully"
        });

    } catch (error) {
        res.json({
            status: "error",
            message: "Error creating message"
        });
    }
};



// export all functions
module.exports = {
    createMessageByBusiness,
    createMessageByStaff
};