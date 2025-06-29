// Weather Forecast Tool for Tooluxe
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('weather-search-form');
    const locationInput = document.getElementById('location-input');
    const weatherResults = document.getElementById('weather-results');
    const weatherError = document.getElementById('weather-error');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // API key for OpenWeatherMap (free tier)
    const apiKey = '5f0f5e7d9307cdc7d4973ede8e2d15cc';
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const location = locationInput.value.trim();
        
        if (location === '') {
            showError('Please enter a location');
            return;
        }
        
        getWeatherData(location);
    });
    
    function getWeatherData(location) {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        weatherResults.style.display = 'none';
        weatherError.style.display = 'none';
        
        // Fetch weather data from OpenWeatherMap API
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found');
                }
                return response.json();
            })
            .then(data => {
                displayWeatherData(data);
                loadingIndicator.style.display = 'none';
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                showError(error.message);
            });
    }
    
    function displayWeatherData(data) {
        // Format and display weather data
        const cityName = data.name;
        const country = data.sys.country;
        const temperature = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        
        // Create HTML for weather display
        const weatherHTML = `
            <div class="weather-header">
                <h3>${cityName}, ${country}</h3>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
            </div>
            <div class="weather-details">
                <div class="temperature">
                    <span class="temp-value">${temperature}°C</span>
                    <span class="temp-description">${description}</span>
                </div>
                <div class="weather-info">
                    <div class="info-item">
                        <i class="fas fa-thermometer-half"></i>
                        <span>Feels like: ${feelsLike}°C</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-tint"></i>
                        <span>Humidity: ${humidity}%</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-wind"></i>
                        <span>Wind: ${windSpeed} m/s</span>
                    </div>
                </div>
            </div>
        `;
        
        weatherResults.innerHTML = weatherHTML;
        weatherResults.style.display = 'block';
    }
    
    function showError(message) {
        weatherError.textContent = message;
        weatherError.style.display = 'block';
        weatherResults.style.display = 'none';
    }
});
