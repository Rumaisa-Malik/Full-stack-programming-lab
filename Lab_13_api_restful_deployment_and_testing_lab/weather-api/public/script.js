
// SkyFlow Weather App Controller

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const recentTags = document.getElementById("recentTags");
const recentSearchesContainer = document.getElementById("recentSearches");
const weatherDashboard = document.getElementById("weatherDashboard");
const skeletonLoader = document.getElementById("skeletonLoader");
const errorCard = document.getElementById("errorCard");
const errorText = document.getElementById("errorText");
const zeroState = document.getElementById("zeroState");

// Telemetry Fields
const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const currentTemp = document.getElementById("currentTemp");
const weatherCondition = document.getElementById("weatherCondition");
const weatherDesc = document.getElementById("weatherDesc");
const weatherIconContainer = document.getElementById("weatherIconContainer");

// Metrics Fields
const apparentTemp = document.getElementById("apparentTemp");
const humidityVal = document.getElementById("humidityVal");
const humidityProgress = document.getElementById("humidityProgress");
const uvIndexVal = document.getElementById("uvIndexVal");
const uvBadge = document.getElementById("uvBadge");
const latCoord = document.getElementById("latCoord");
const lonCoord = document.getElementById("lonCoord");
const hourlyTimeline = document.getElementById("hourlyTimeline");

// Search History State (Initialized from localStorage)
let searchHistory = JSON.parse(localStorage.getItem("skyflow_history")) || [];

// Initialize app on page load
document.addEventListener("DOMContentLoaded", () => {
    renderHistory();
    
    // Add event listeners
    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) triggerSearch(city);
    });

    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const city = cityInput.value.trim();
            if (city) triggerSearch(city);
        }
    });
});

// Render history capsule tags
function renderHistory() {
    recentTags.innerHTML = "";
    if (searchHistory.length === 0) {
        recentSearchesContainer.style.display = "none";
        return;
    }
    
    recentSearchesContainer.style.display = "flex";
    searchHistory.forEach(city => {
        const pill = document.createElement("button");
        pill.className = "recent-pill";
        pill.textContent = city;
        pill.addEventListener("click", () => {
            cityInput.value = city;
            triggerSearch(city);
        });
        recentTags.appendChild(pill);
    });
}

// Add search entry to history
function saveToHistory(city) {
    // Format city name: capitalized first letter of each word
    const formattedCity = city.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

    // Filter out duplicates and keep only the 5 most recent
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== formattedCity.toLowerCase());
    searchHistory.unshift(formattedCity);
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }
    
    localStorage.setItem("skyflow_history", JSON.stringify(searchHistory));
    renderHistory();
}

// Helper to resolve main FontAwesome icon and colors based on weather state class
function getWeatherIcon(conditionClass) {
    switch (conditionClass) {
        case 'sunny':
            return '<i class="fa-solid fa-sun fa-spin-slow" style="color: #fbbf24; filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));"></i>';
        case 'night':
            return '<i class="fa-solid fa-moon" style="color: #a78bfa; filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.4));"></i>';
        case 'cloudy':
            return '<i class="fa-solid fa-cloud-sun" style="color: #cbd5e1; filter: drop-shadow(0 0 10px rgba(203, 213, 225, 0.3));"></i>';
        case 'night-cloudy':
            return '<i class="fa-solid fa-cloud-moon" style="color: #94a3b8; filter: drop-shadow(0 0 10px rgba(148, 163, 184, 0.3));"></i>';
        case 'foggy':
            return '<i class="fa-solid fa-smog" style="color: #94a3b8; filter: drop-shadow(0 0 8px rgba(148, 163, 184, 0.2));"></i>';
        case 'rainy':
            return '<i class="fa-solid fa-cloud-showers-heavy" style="color: #60a5fa; filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.4));"></i>';
        case 'snowy':
            return '<i class="fa-solid fa-snowflake" style="color: #93c5fd; filter: drop-shadow(0 0 10px rgba(147, 197, 253, 0.4));"></i>';
        case 'stormy':
            return '<i class="fa-solid fa-cloud-bolt" style="color: #c084fc; filter: drop-shadow(0 0 12px rgba(192, 132, 252, 0.5));"></i>';
        default:
            return '<i class="fa-solid fa-cloud" style="color: #38bdf8;"></i>';
    }
}

// Helper to get mini-icons for hourly list items depending on temperature
function getHourlyIcon(temp) {
    if (temp > 24) return '<i class="fa-solid fa-sun hourly-icon" style="color: #fbbf24;"></i>';
    if (temp > 15) return '<i class="fa-solid fa-cloud-sun hourly-icon" style="color: #cbd5e1;"></i>';
    if (temp > 6) return '<i class="fa-solid fa-cloud hourly-icon" style="color: #94a3b8;"></i>';
    return '<i class="fa-solid fa-snowflake hourly-icon" style="color: #93c5fd;"></i>';
}

// Helper to format UV index level badge
function configureUvBadge(value) {
    uvBadge.className = "uv-badge"; // Reset classes
    if (value === null || value === undefined) {
        uvBadge.textContent = "N/A";
        uvBadge.classList.add("hidden");
        return;
    }
    
    uvBadge.classList.remove("hidden");
    if (value <= 2.9) {
        uvBadge.textContent = "Low";
        uvBadge.classList.add("uv-low");
    } else if (value <= 5.9) {
        uvBadge.textContent = "Moderate";
        uvBadge.classList.add("uv-moderate");
    } else if (value <= 7.9) {
        uvBadge.textContent = "High";
        uvBadge.classList.add("uv-high");
    } else {
        uvBadge.textContent = "Very High";
        uvBadge.classList.add("uv-veryhigh");
    }
}

// Primary search execution method
async function triggerSearch(city) {
    if (!city) return;

    // Show Loader & Hide others
    skeletonLoader.classList.remove("hidden");
    weatherDashboard.classList.add("hidden");
    errorCard.classList.add("hidden");
    zeroState.classList.add("hidden");

    try {
        const response = await fetch(`/weather/${encodeURIComponent(city)}`);
        const data = await response.json();

        // Check for backend errors
        if (data.error) {
            showError(data.error);
            return;
        }

        // 1. Swap body class for dynamic gradient backgrounds
        document.body.className = "";
        document.body.classList.add(`weather-${data.class}`);

        // 2. Render primary weather details
        cityName.textContent = data.city;
        countryName.textContent = data.state ? `${data.state}, ${data.country}` : data.country;
        currentTemp.textContent = data.temperature.toFixed(1);
        weatherCondition.textContent = data.condition;
        weatherDesc.textContent = data.description;
        weatherIconContainer.innerHTML = getWeatherIcon(data.class);

        // 3. Render telemetry metrics
        apparentTemp.textContent = data.apparent_temperature.toFixed(1);
        humidityVal.textContent = data.humidity;
        humidityProgress.style.width = `${data.humidity}%`;
        uvIndexVal.textContent = data.uv_index !== null ? data.uv_index.toFixed(1) : "N/A";
        configureUvBadge(data.uv_index);
        latCoord.textContent = data.latitude.toFixed(4);
        lonCoord.textContent = data.longitude.toFixed(4);

        // 4. Render 6-hour hourly forecast timeline
        hourlyTimeline.innerHTML = "";
        if (data.hourly && data.hourly.length > 0) {
            data.hourly.forEach(hour => {
                const hourCard = document.createElement("div");
                hourCard.className = "hourly-card";
                
                // Format time string: e.g. "12:00" -> "12:00" or simple hours
                const timeLabel = hour.time;
                const iconHtml = getHourlyIcon(hour.temperature);
                
                hourCard.innerHTML = `
                    <span class="hourly-time">${timeLabel}</span>
                    ${iconHtml}
                    <span class="hourly-temp">${hour.temperature.toFixed(1)}°C</span>
                    <span class="hourly-feels">Feels ${hour.apparent_temperature.toFixed(0)}°</span>
                `;
                hourlyTimeline.appendChild(hourCard);
            });
        } else {
            hourlyTimeline.innerHTML = `<p class="metric-footer">No hourly forecast points available.</p>`;
        }

        // 5. Hide Loader & Reveal Dashboard
        skeletonLoader.classList.add("hidden");
        weatherDashboard.classList.remove("hidden");

        // 6. Save successful searches to local storage history
        saveToHistory(city);

    } catch (error) {
        console.error("Fetch failure:", error);
        showError("Failed to fetch weather telemetry. Please check your network connection and try again.");
    }
}

// Display beautiful error cards
function showError(msg) {
    // Revert body class to default
    document.body.className = "weather-default";

    errorText.textContent = msg;
    
    skeletonLoader.classList.add("hidden");
    weatherDashboard.classList.add("hidden");
    zeroState.classList.add("hidden");
    errorCard.classList.remove("hidden");
}

// Zero-state focus search helper
function focusSearch() {
    cityInput.focus();
    cityInput.select();
    errorCard.classList.add("hidden");
    zeroState.classList.remove("hidden");
}