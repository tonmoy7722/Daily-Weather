const apiKey = 'ece06f1ffb434337b25123309241007';

const searchInput = document.getElementById('search-location');
const searchButton = document.getElementById('search-button');
const weatherInfo = document.getElementById('weather-info');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const precipitation = document.getElementById('precipitation');
const cloudCover = document.getElementById('cloud-cover');
const weatherIcon = document.getElementById('weather-icon');
const backButton = document.getElementById('back-button');
const forecastContainer = document.getElementById('forecast-container');
const forecastSlider = document.getElementById('forecast-slider');
const prevHourButton = document.getElementById('prev-hour');
const nextHourButton = document.getElementById('next-hour');

let hourlyData = [];
let currentIndex = 0;

async function getWeatherData(location) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&hours=24`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.error) {
            weatherInfo.textContent = `Error: ${data.error.message}`;
            forecastContainer.style.display = 'none'; // Hide the forecast box on error
            backButton.style.display = 'none'; // Hide the back button on error
        } else {
            const city = data.location.name;
            const temperatureValue = data.current.temp_c;
            const weatherConditionValue = data.current.condition.text;
            const weatherIconUrl = data.current.condition.icon;
            const precip = data.current.precip_mm;
            const cloud = data.current.cloud;

            // Get hourly forecast data
            hourlyData = data.forecast.forecastday[0].hour;
            currentIndex = 0; // Reset index
            
            // Get current local time at the searched location
            const localTime = data.location.localtime;

            // Format the local time using toLocaleTimeString
            const formattedTime = new Date(localTime).toLocaleTimeString('en-US', { hour24: true });


            // Update weather info
            weatherInfo.innerHTML = `
                <h3>${formattedTime} - ${city} (${data.location.country})</h3>
                <img id="weather-icon" src="${weatherIconUrl}" alt="${weatherConditionValue}">
                <p id="temperature">Temperature: ${temperatureValue}°C</p>
                <p id="weather-condition">Weather: ${weatherConditionValue}</p>
                <p id="precipitation">Chance of Precipitation: ${precip}%</p>
                <p id="cloud-cover">Cloud Cover: ${cloud}%</p>
            `;

            // Display hourly forecast
            displayHourlyForecast();
            forecastContainer.style.display = 'block'; // Show forecast box
            backButton.style.display = 'block'; // Show back button
        }
    } catch (error) {
        console.error(error);
        weatherInfo.textContent = 'Error fetching weather data.';
        forecastContainer.style.display = 'none'; // Hide the forecast box on error
        backButton.style.display = 'none'; // Hide the back button on error
    }
}

function displayHourlyForecast() {
    forecastSlider.innerHTML = '';
    const numberOfHours = hourlyData.length;
    const itemsToShow = 6;

    for (let i = currentIndex; i < Math.min(currentIndex + itemsToShow, numberOfHours); i++) {
        const hourData = hourlyData[i];
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-hour');
        forecastElement.innerHTML = `
            <p>${hourData.time.split(' ')[1]}</p>
            <img src="${hourData.condition.icon}" alt="${hourData.condition.text}">
            <p>${hourData.temp_c}°C</p>
            <p>${hourData.condition.text}</p>
        `;
        forecastSlider.appendChild(forecastElement);
    }
}

prevHourButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex -= 6;
        displayHourlyForecast();
    }
});

nextHourButton.addEventListener('click', () => {
    if (currentIndex + 6 < hourlyData.length) {
        currentIndex += 6;
        displayHourlyForecast();
    }
});

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Please enter a location to search.');
        return;
    }

    getWeatherData(searchTerm);
});

backButton.addEventListener('click', () => {
    searchInput.value = '';
    weatherInfo.innerHTML = `
        <h2>Get the weather details of any city, Right Now!</h2>
        <img id="weather-icon" src="" alt="Weather Icon" style="visibility: hidden;">
        <p id="temperature">Temperature: -°C</p>
        <p id="weather-condition">Current Weather: </p>
        <p id="precipitation">Chance of Precipitation: -%</p>
        <p id="cloud-cover">Cloud Cover: -%</p>
    `;
    forecastSlider.innerHTML = ''; // Clear forecast data
    forecastContainer.style.display = 'none'; // Hide the forecast box
    backButton.style.display = 'none'; // Hide the back button
});
