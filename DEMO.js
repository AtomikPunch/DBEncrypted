const axios = require('axios');
const db = require('./database');
const { fetchWeatherData } = require('./AppelAPI');
const { attemptAccess } = require('./DoorsMecanism');
const { initializeDatabase , getDatabase} = require('./database');
require('dotenv').config()

initializeDatabase();

fetchWeatherData(); // Initial fetch

// Example of simulating access attempts
attemptAccess(1, 2); // Unauthorized attempt
attemptAccess(1, 1); // Unauthorized attempt
attemptAccess(1, 1); // Unauthorized attempt
attemptAccess(1, 1); // Unauthorized attempt
attemptAccess(1, 1); // Unauthorized attempt (should disable the door)
