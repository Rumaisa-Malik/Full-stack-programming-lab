const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS so the API can be accessed externally if needed
app.use(cors());

// Serve frontend files from public folder
app.use(express.static("public"));

// Helper function to map WMO Weather Interpretation Codes (WW)
// https://open-meteo.com/en/docs
function mapWeatherCode(code, isDay) {
    if (code === 0) {
        return {
            condition: "Clear",
            description: isDay ? "Sunny" : "Clear Sky",
            class: isDay ? "sunny" : "night"
        };
    }
    if ([1, 2, 3].includes(code)) {
        return {
            condition: "Cloudy",
            description: code === 1 ? "Mainly Clear" : code === 2 ? "Partly Cloudy" : "Overcast",
            class: isDay ? "cloudy" : "night-cloudy"
        };
    }
    if ([45, 48].includes(code)) {
        return {
            condition: "Foggy",
            description: code === 45 ? "Fog" : "Depositing Rime Fog",
            class: "foggy"
        };
    }
    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            condition: "Drizzle",
            description: "Light Drizzle",
            class: "rainy"
        };
    }
    if ([61, 63, 65, 66, 67].includes(code)) {
        return {
            condition: "Rainy",
            description: code === 61 ? "Slight Rain" : code === 63 ? "Moderate Rain" : "Heavy Rain",
            class: "rainy"
        };
    }
    if ([71, 73, 75, 77].includes(code)) {
        return {
            condition: "Snowy",
            description: "Snow Fall",
            class: "snowy"
        };
    }
    if ([80, 81, 82].includes(code)) {
        return {
            condition: "Rain Showers",
            description: "Showers",
            class: "rainy"
        };
    }
    if ([85, 86].includes(code)) {
        return {
            condition: "Snow Showers",
            description: "Snow Showers",
            class: "snowy"
        };
    }
    if ([95, 96, 99].includes(code)) {
        return {
            condition: "Thunderstorm",
            description: "Thunderstorm",
            class: "stormy"
        };
    }
    return {
        condition: "Clear",
        description: "Clear",
        class: isDay ? "sunny" : "night"
    };
}

// Weather API Endpoint
app.get("/weather/:city", async (req, res) => {
    const city = req.params.city ? req.params.city.trim() : "";

    if (!city) {
        return res.status(400).json({
            error: "City parameter is required"
        });
    }

    try {
        // Step 1: Call Open-Meteo Geocoding API to get city coordinates
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await axios.get(geoUrl);

        // Handle case where city results are missing or empty
        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            return res.status(404).json({
                error: `City '${city}' not found. Please verify the name and try again.`
            });
        }

        const location = geoResponse.data.results[0];
        const { latitude, longitude, name, country, admin1 } = location;

        // Step 2: Fetch detailed weather info from Open-Meteo Forecast API
        // This includes current, daily (uv_index_max), and hourly parameters (temp, apparent temp) as specified.
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day&daily=uv_index_max&hourly=temperature_2m,apparent_temperature&timezone=auto`;
        
        const weatherResponse = await axios.get(weatherUrl);
        const data = weatherResponse.data;

        if (!data || !data.current) {
            return res.status(500).json({
                error: "Failed to parse weather telemetry data from external service."
            });
        }

        const current = data.current;
        const daily = data.daily;
        const hourly = data.hourly;

        // Map the weather code to condition metadata
        const weatherInfo = mapWeatherCode(current.weather_code, current.is_day);

        // Step 3: Extract relevant hourly forecast for the next 6 hours
        const hourlyForecast = [];
        if (hourly && hourly.time) {
            const currentHourStr = current.time.substring(0, 13) + ":00";
            let startIndex = hourly.time.indexOf(currentHourStr);
            if (startIndex === -1) {
                startIndex = 0; // fallback to start of day
            }

            for (let i = startIndex; i < Math.min(startIndex + 6, hourly.time.length); i++) {
                hourlyForecast.push({
                    time: hourly.time[i].split("T")[1], // Extracted e.g. "14:00"
                    temperature: hourly.temperature_2m[i],
                    apparent_temperature: hourly.apparent_temperature[i]
                });
            }
        }

        // Send JSON response matching required criteria + premium expansions
        res.json({
            city: name,
            country: country || "",
            state: admin1 || "",
            latitude,
            longitude,
            temperature: current.temperature_2m,
            temperature_unit: data.current_units?.temperature_2m || "°C",
            apparent_temperature: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            humidity_unit: data.current_units?.relative_humidity_2m || "%",
            weather_code: current.weather_code,
            condition: weatherInfo.condition,
            description: weatherInfo.description,
            class: weatherInfo.class,
            is_day: current.is_day === 1,
            uv_index: daily && daily.uv_index_max ? daily.uv_index_max[0] : null,
            hourly: hourlyForecast
        });

    } catch (error) {
        console.error("Weather API Error:", error.message);
        res.status(500).json({
            error: "Failed to fetch weather data. The weather service may be temporarily unavailable."
        });
    }
});

// Also support standard REST route pattern /api/weather/:city for cleaner architecture
app.get("/api/weather/:city", async (req, res) => {
    // Redirect to main endpoint logic
    req.url = `/weather/${req.params.city}`;
    app.handle(req, res);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});