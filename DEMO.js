const { fetchWeatherData } = require("./AppelAPI");
const { attemptAccess } = require("./DoorsMecanism");
const { initializeDatabase, insertInitialData, createTables } =
	require("./database");
require("dotenv").config();

async function main() {
	try {
		await initializeDatabase();
		await fetchWeatherData(); // Initial fetch

		// Example of simulating access attempts
		await attemptAccess(1, 2); // authorized attempt
		await attemptAccess(1, 1); // Unauthorized attempt
		await attemptAccess(1, 1); // Unauthorized attempt
		await attemptAccess(1, 1); // Unauthorized attempt
		await attemptAccess(1, 1); // Unauthorized attempt 
		await attemptAccess(1, 1); // Unauthorized attempt should disable the door
	} catch (error) {
		console.error("Error in main:", error);
		process.exit(1);
	}
}

main();
