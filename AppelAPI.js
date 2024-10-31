const axios = require("axios");
require("dotenv").config();
const { getDb } = require("./database");

async function fetchWeatherData() {
	const db = getDb();
	try {
		// Appel API
		const response = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?q=peshawar&appid=${process.env.API_KEY}`,
		);

		// Vérifier le statut de la réponse
		if (response.status !== 200) {
			throw new Error(`API Error: Received status ${response.status}`);
		}

		// Extraction des données
		const { temp: temperature, humidity } = response.data.main;
		console.log("--------------------------API CALL--------------------------");
		console.log("Temperature: ", temperature, "K");
		console.log("Humidity: ", humidity, "%");

		console.log(db);
		// Insertion en base de données
		
		db.run(
			"INSERT INTO Weather (Temperature, Humidity) VALUES (?, ?)",
			[temperature, humidity],
			(err) => {
				if (err) {
					console.error("Database Insertion Error:", err.message);
					return;
				}
				console.log(
					`Weather data inserted for - Temperature: ${temperature}K, Humidity: ${humidity}%`,
				);
			},
		);

		// Ajustement de la température pour l'AC
		adjustAC(temperature);
	} catch (error) {
		// Afficher un message d'erreur succinct
		console.error(
			"An error occurred while fetching or processing weather data:",
			error.message,
		);

		// En cas d'erreur réseau, envisager une nouvelle tentative
		if (error.response) {
			console.error(`API returned status: ${error.response.status}`);
		} else if (error.request) {
			console.error("No response received from API");
		} else {
			console.error("Error:", error.message);
		}
	}
}

async function adjustAC(temp) {
	if (temp >= 300) {
		console.log("Setting AC to 23 degrees");
	} else if (temp >= 298) {
		console.log("Setting AC to 25 degrees");
	} else if (temp >= 293) {
		console.log("Disabling AC");
	}
}

module.exports = { fetchWeatherData };
