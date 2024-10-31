let sqlite3 = require('@journeyapps/sqlcipher').verbose();

let db = null;

async function initializeDatabase() {
	try {
		db = new sqlite3.Database("./test.db");

		db.run(`PRAGMA key = '${process.env.DB_PASSWORD}';`, (pragmaErr) => {
			if (pragmaErr) {
				console.error("Error setting database key:", pragmaErr.message);
				return reject(pragmaErr);
			}
			console.log("Database key set successfully");
			
		});
		db.run("UPDATE Doors SET IsDisabled = 1 WHERE ID = ?", [1], (err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log(
				`Door ID has been disabled due to excessive unauthorized access attempts.`,
			);
		});
		
		//await createTables();
		//await insertInitialData();
	} catch (error) {
		console.error("Error initializing database:", error.message);
	}
}

//Creation de la base de données avec sqlite
async function createTables() {
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
        );`,
	];

	for (const sql of sqlStatements) {
		db.run(sql, (err) => {
			if (err) {
				throw err;
			}
		});
	}
}

// Function to insert initial data
async function insertInitialData() {
	// Sample users to insert
	const users = [
		{ Nom: "Doe", Prenom: "John", Role: "Admin" },
		{ Nom: "Smith", Prenom: "Jane", Role: "User" },
		{ Nom: "Brown", Prenom: "Michael", Role: "User" },
		{ Nom: "Johnson", Prenom: "Emily", Role: "User" },
		{ Nom: "Williams", Prenom: "David", Role: "User" },
	];

	for (const user of users) {
		await new Promise((resolve, reject) => {
			db.run(
				"INSERT INTO User (Nom, Prenom, Role) VALUES (?, ?, ?)",
				[user.Nom, user.Prenom, user.Role],
				(err) => (err ? reject(err) : resolve()),
			);
		});
	}

	// Sample doors to insert with allowed roles
	const doors = [
		{ Status: "Locked", Location: "Main Entrance", AllowedRoles: "Admin,User" },
		{ Status: "Unlocked", Location: "Back Entrance", AllowedRoles: "Admin" },
	];

	for (const door of doors) {
		await new Promise((resolve, reject) => {
			db.run(
				"INSERT INTO Doors (Status, Location, AllowedRoles) VALUES (?, ?, ?)",
				[door.Status, door.Location, door.AllowedRoles],
				(err) => (err ? reject(err) : resolve()),
			);
		});
	}
}

function getDb() {
	return db;
}



/*let dbtest = new sqlite3.Database('test.db');

db.serialize(function() {
  //db.run("PRAGMA cipher_compatibility = 4");

  // To open a database created with SQLCipher 3.x, use this:
  db.run("PRAGMA cipher_compatibility = 3");

  db.run("PRAGMA key = 'mysecret'");
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});*/

module.exports = {
	initializeDatabase,
	getDb,
	insertInitialData,
	createTables,
};
