'use strict'

// dotenv is used to read the .env file
const dotenv = require('dotenv');
const assert = require('assert');

// Access the .env file
dotenv.config();


// Access all the environment variables from the .env file
const {
    PORT,
    HOST,
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID
} = process.env;



// Assert the environment variables are set
assert (PORT, 'PORT is required');
assert (HOST, 'HOST is required');


// Export the environment variables to be used in the firebaseDbInit.js file
module.exports = {
    port: PORT,
    host: HOST,
    hostUrl: HOST_URL,
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseUrl: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
};