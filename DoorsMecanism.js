const axios = require('axios');
const db = require('./database');


// Log access attempt function
async function logAccessAttempt(userID, doorID, accessStatus) {
    const timestamp = new Date().toISOString();
    db.run(`INSERT INTO AccessLogs (Timestamp, UserID, DoorID, AccessStatus) VALUES (?, ?, ?, ?)`,
        [timestamp, userID, doorID, accessStatus], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log('------------------------------------------------------------')
            console.log(`Logged access attempt for UserID: ${userID}, DoorID: ${doorID}, Status: ${accessStatus}`);
        });
    // Check for unauthorized attempts
    if (accessStatus === 'Unauthorized') {
        checkUnauthorizedAttempts(doorID);
    }
}

// Check unauthorized attempts
async function checkUnauthorizedAttempts(doorID) {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    db.get(`SELECT COUNT(*) as count FROM AccessLogs WHERE DoorID = ? AND AccessStatus = 'Unauthorized' AND Timestamp >= ?`,
        [doorID, tenMinutesAgo], (err, row) => {
            if (err) {
                return console.error(err.message);
            }

            const count = row.count;
            console.log(`Unauthorized attempts in the last 10 minutes: ${count}`);

            if (count >= 5) { // 5 or more unauthorized attempts
                disableDoor(doorID);
            }
        });
}

// Disable door
async function disableDoor(doorID) {
    db.run(`UPDATE Doors SET IsDisabled = 1 WHERE ID = ?`, [doorID], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Door ID ${doorID} has been disabled due to excessive unauthorized access attempts.`);
    });
}

// Simulate access attempt
async function attemptAccess(userID, doorID) {
    // Retrieve the user's role
    const userRole = await getUserRole(userID);
    
    // Retrieve the allowed roles for the door
    const allowedRoles = await getAllowedRoles(doorID);

    // Check if the user is authorized based on their role
    const accessStatus = allowedRoles.includes(userRole) ? 'Authorized' : 'Unauthorized';

    // Log the access attempt
    await logAccessAttempt(userID, doorID, accessStatus);
    
    if (accessStatus === 'Authorized') {
        console.log('Access granted.');
        await toggleDoorStatus(doorID);
    } else {
        console.log('Access denied.');
    }
}

// Function to get user's role
async function getUserRole(userID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT Role FROM User WHERE ID = ?', [userID], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? row.Role : null);
        });
    });
}

// Function to get allowed roles for the door
async function getAllowedRoles(doorID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT AllowedRoles FROM Doors WHERE ID = ?', [doorID], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? row.AllowedRoles.split(',') : []);
        });
    });
}



async function toggleDoorStatus(doorID) {
    return new Promise((resolve, reject) => {
        // Get the current status of the door
        db.get(`SELECT Status FROM Doors WHERE ID = ?`, [doorID], (err, row) => {
            if (err) {
                return reject(err);
            }

            // Determine the new status based on the current status
            const newStatus = row.Status === 'Locked' ? 'Unlocked' : 'Locked';

            // Update the door's status in the database
            db.run(`UPDATE Doors SET Status = ? WHERE ID = ?`, [newStatus, doorID], function(err) {
                if (err) {
                    return reject(err);
                }
                console.log(`Door status updated to: ${newStatus}`);
                resolve(newStatus);
            });
        });
    });
}

module.exports = { attemptAccess };