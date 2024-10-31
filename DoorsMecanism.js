const { getDb } = require("./database");

// log les tentatives
async function logAccessAttempt(userID, doorID, accessStatus) {
	const db = getDb();
	const timestamp = new Date().toISOString();
	db.run(
		"INSERT INTO AccessLogs (Timestamp, UserID, DoorID, AccessStatus) VALUES (?, ?, ?, ?)",
		[timestamp, userID, doorID, accessStatus],
		(err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log(
				`Logged access attempt for UserID: ${userID}, DoorID: ${doorID}, Status: ${accessStatus}`,
			);
		},
	);
	// si la tentative n'est pas authorisé
	if (accessStatus === "Unauthorized") {
		checkUnauthorizedAttempts(doorID);
	}
}

// Vérification de la tentative
async function checkUnauthorizedAttempts(doorID) {
	const db = getDb();
	const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

	db.get(
		`SELECT COUNT(*) as count FROM AccessLogs WHERE DoorID = ? AND AccessStatus = 'Unauthorized' AND Timestamp >= ?`,
		[doorID, tenMinutesAgo],
		(err, row) => {
			if (err) {
				return console.error(err.message);
			}

			const count = row.count;
			console.log(`Unauthorized attempts in the last 10 minutes: ${count}`);

			if (count >= 5) {
				disableDoor(doorID);
			}
		},
	);
}

// Disable door afin d'avoir une trace de son status
async function disableDoor(doorID) {
	const db = getDb();
	db.run("UPDATE Doors SET IsDisabled = 1 WHERE ID = ?", [doorID], (err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(
			`Door ID ${doorID} has been disabled due to excessive unauthorized access attempts.`,
		);
	});
}

// Simulate access attempt
async function attemptAccess(userID, doorID) {
	const userRole = await getUserRole(userID);

	const allowedRoles = await getAllowedRoles(doorID);

	const accessStatus = allowedRoles.includes(userRole)
		? "Authorized"
		: "Unauthorized";

	await logAccessAttempt(userID, doorID, accessStatus);

	if (accessStatus === "Authorized") {
		console.log(
			"------------------------------------------------------------",
		);
		console.log("Access granted.");
		await toggleDoorStatus(doorID);
	} else {
		console.log(
			"------------------------------------------------------------",
		);
		console.log("Access denied.");
	}
}

// avoir le rôle de l'utilisateur
async function getUserRole(userID) {
	const db = getDb();
	return new Promise((resolve, reject) => {
		db.get("SELECT Role FROM User WHERE ID = ?", [userID], (err, row) => {
			if (err) {
				return reject(err);
			}
			resolve(row ? row.Role : null);
		});
	});
}

// avoir le rôle authorisé pour ouvrir ou fermer la porte
async function getAllowedRoles(doorID) {
	const db = getDb();
	return new Promise((resolve, reject) => {
		db.get(
			"SELECT AllowedRoles FROM Doors WHERE ID = ?",
			[doorID],
			(err, row) => {
				if (err) {
					return reject(err);
				}
				resolve(row ? row.AllowedRoles.split(",") : []);
			},
		);
	});
}

async function toggleDoorStatus(doorID) {
	const db = getDb();
	return new Promise((resolve, reject) => {
		db.get("SELECT Status FROM Doors WHERE ID = ?", [doorID], (err, row) => {
			if (err) {
				return reject(err);
			}

			// Determiner le nouveau status basé sur le status precédent
			const newStatus = row.Status === "Locked" ? "Unlocked" : "Locked";

			db.run(
				"UPDATE Doors SET Status = ? WHERE ID = ?",
				[newStatus, doorID],
				(err) => {
					if (err) {
						return reject(err);
					}
					console.log(`Door status updated to: ${newStatus}`);
					resolve(newStatus);
				},
			);
		});
	});
}

module.exports = { attemptAccess };
