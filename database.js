const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

let db;

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./encryptedDB.db', (err) => {
            if (err) {
                console.error('Connection error:', err.message);
                return reject(err);
            }
            console.log('Connected to the encrypted database.');

            db.run(`PRAGMA key = '${process.env.DB_PASSWORD}';`, (pragmaErr) => {
                if (pragmaErr) {
                    console.error('Error setting the database key:', pragmaErr.message);
                    return reject(pragmaErr);
                } else {
                    console.log('Database key set successfully');
                    resolve(); // Resolve the promise to indicate that the database is ready
                }
            });
        });
    });
}

// Export the database instance for use in other modules
function getDatabase() {
    return db;
}
initializeDatabase();

module.exports = { initializeDatabase, getDatabase };


//Creation de la base de données avec sqlite
const createTables = () => {
    const sqlStatements = [
        `CREATE TABLE IF NOT EXISTS User (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nom TEXT NOT NULL,
            Prenom TEXT NOT NULL,
            Role TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS Doors (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Status TEXT NOT NULL CHECK (Status IN ('Locked', 'Unlocked')),
            Location TEXT NOT NULL,
            IsDisabled INTEGER DEFAULT 0,
            AllowedRoles TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS Alarms (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            AlarmType TEXT NOT NULL,
            DoorID INTEGER,
            DoorActualState TEXT,
            Date DATE NOT NULL,
            Time TIME NOT NULL,
            Field TEXT,
            FOREIGN KEY (DoorID) REFERENCES Doors(ID)
        );`,
        `CREATE TABLE IF NOT EXISTS AccessLogs (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Timestamp DATETIME NOT NULL,       -- Changed to a single DATETIME column
            UserID INTEGER,
            DoorID INTEGER,
            AccessStatus TEXT NOT NULL,
            FOREIGN KEY (UserID) REFERENCES User(ID),
            FOREIGN KEY (DoorID) REFERENCES Doors(ID)
        );`,
        `CREATE TABLE IF NOT EXISTS Weather (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Temperature REAL NOT NULL,
            Humidity REAL NOT NULL
        );`
    ];

    // Execute each SQL statement
    sqlStatements.forEach(sql => {
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                //console.log('Table created or already exists.');
            }
        });
    });
};



// Function to insert initial data
const insertInitialData = () => {
    // Sample users to insert
    const users = [
        { Nom: 'Doe', Prenom: 'John', Role: 'Admin' },
        { Nom: 'Smith', Prenom: 'Jane', Role: 'User' },
        { Nom: 'Brown', Prenom: 'Michael', Role: 'User' },
        { Nom: 'Johnson', Prenom: 'Emily', Role: 'User' },
        { Nom: 'Williams', Prenom: 'David', Role: 'User' }
    ];

    // Insert users
    users.forEach(user => {
        db.run(`INSERT INTO User (Nom, Prenom, Role) VALUES (?, ?, ?)`, [user.Nom, user.Prenom, user.Role], function(err) {
            if (err) {
                console.error(err.message);
            } else {
                //console.log(`User added: ${user.Prenom} ${user.Nom}`);
            }
        });
    });

    // Sample doors to insert with allowed roles
    const doors = [
        { Status: 'Locked', Location: 'Main Entrance', AllowedRoles: 'Admin,User' },
        { Status: 'Unlocked', Location: 'Back Entrance', AllowedRoles: 'Admin' }
    ];

    // Insert doors
    doors.forEach(door => {
        db.run(`INSERT INTO Doors (Status, Location, AllowedRoles) VALUES (?, ?, ?)`, 
        [door.Status, door.Location, door.AllowedRoles], function(err) {
            if (err) {
                console.error(err.message);
            } else {
                //console.log(`Door added: ${door.Location}`);
            }
        });
    });
};


// Create the tables and insert initial data
//createTables();
//insertInitialData();

// Export the database instance
//module.exports = db;
