// import firebase
const firebase = require("firebase");
const firebaseConfig = require('../Config/firebaseConfig');

// Initialize Firebase database
firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

// Export the database
module.exports = database;