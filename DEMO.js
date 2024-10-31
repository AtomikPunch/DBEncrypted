const { fetchWeatherData } = require("./AppelAPI");
const { attemptAccess } = require("./DoorsMecanism");
const { initializeDatabase, insertInitialData, createTables } =
	require("./database");
require("dotenv").config();

//fonction async pour ne pas executer du sql avant l'authentification pour accéder à la base de données
async function main() {
	try {
		await initializeDatabase();
		await fetchWeatherData();

		await attemptAccess(1, 1); // authorisation d'un admin à une porte destiné qu'au admin
		await attemptAccess(2, 1); // non authorisation d'un user lambda à une porte destiné qu'au admin
		await attemptAccess(2, 1); // non authorisation d'un user lambda à une porte destiné qu'au admin
		await attemptAccess(2, 1); // non authorisation d'un user lambda à une porte destiné qu'au admin
		await attemptAccess(2, 1); // non authorisation d'un user lambda à une porte destiné qu'au admin
		await attemptAccess(2, 1); // non authorisation d'un user lambda à une porte destiné qu'au admin (doit fermer la porte)
		
	} catch (error) {
		console.error("Error in main:", error);
		process.exit(1);
	}
}

main();
