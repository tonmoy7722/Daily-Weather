const apiKey = 'ece06f1ffb434337b25123309241007';

const searchInput = document.getElementById('search-location');
const searchButton = document.getElementById('search-button');
const weatherInfo = document.getElementById('weather-info');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const precipitation = document.getElementById('precipitation');
const cloudCover = document.getElementById('cloud-cover');
const weatherIcon = document.getElementById('weather-icon');

async function getWeatherData(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.error) {
            weatherInfo.textContent = `Error: ${data.error.message}`;
        } else {
            const city = data.location.name;
            const temperatureValue = data.current.temp_c;
            const weatherConditionValue = data.current.condition.text;
            const weatherIconUrl = data.current.condition.icon;
            const precip = data.current.precip_mm;
            const cloud = data.current.cloud;

            // Get current local time at the searched location
            const localTime = data.location.localtime;

            // Format the local time using toLocaleTimeString
            const formattedTime = new Date(localTime).toLocaleTimeString('en-US', { hour12: true });

            // Display current weather
            weatherInfo.innerHTML = `
                <h3>${formattedTime} - ${city} (${data.location.country})</h3>
                <img id="weather-icon" src="${weatherIconUrl}" alt="${weatherConditionValue}">
                <p id="temperature">Temperature: ${temperatureValue}°C</p>
                <p id="weather-condition">Weather: ${weatherConditionValue}</p>
                <p id="precipitation">Chance of Precipitation: ${precip}%</p>
                <p id="cloud-cover">Cloud Cover: ${cloud}%</p>
            `;

            // Make weather icon visible
            weatherIcon.style.visibility = 'visible';
        }
    } catch (error) {
        console.error(error);
        weatherInfo.textContent = 'Error fetching weather data.';
    }
}

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Please enter a location to search.');
        return;
    }

    getWeatherData(searchTerm);
});
