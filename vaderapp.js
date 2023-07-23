document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('cityInput').value;
    var hours = document.getElementById('hoursInput').value / 3;
    fetchWeather(city, hours);
});

function fetchWeather(city, hours) {
    var apiKey = '8357924c1c4db294e859b7e322b36154';
    var cardContainer = document.getElementById('cardContainer');
    cardContainer.style.display = 'none';

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            var lat = data[0].lat;
            var lon = data[0].lon;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('weatherDescription').textContent = data.weather[0].description;
                    document.getElementById('weatherTemperature').textContent = data.main.temp + ' °C';
                    document.getElementById('weatherWindSpeed').textContent = data.wind.speed + ' m/s';
                    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

                    var temperature = data.main.temp;
                    changeBackgroundBasedOnTemperature(temperature);

                    cardContainer.style.display = 'flex';
                })
                .catch(error => {
                    document.getElementById('errorMessage').textContent = 'Det gick inte att hämta vädret. Försök igen senare.';
                });

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    var forecastContainer = document.getElementById('forecastContainer');
                    forecastContainer.innerHTML = '';

                    for (let i = 0; i < hours; i++) {
                        var forecast = data.list[i];
                        var forecastElement = document.createElement('div');
                        var date = new Date(forecast.dt_txt);
                        var forecastHours = date.getHours();
                        var minutes = date.getMinutes();
                        var formattedTime = forecastHours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
                        forecastElement.innerHTML = `
                            <img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png">
                            <div>${forecast.main.temp} °C</div>
                            <div class="forecastTime">${formattedTime}</div>
                        `;
                        forecastContainer.appendChild(forecastElement);
                    }
                })
                .catch(error => {
                    document.getElementById('errorMessage').textContent = 'Det gick inte att hämta vädret. Försök igen senare.';
                });
        })
        .catch(error => {
            document.getElementById('errorMessage').textContent = 'Staden kunde inte hittas. Försök igen.';
        });
}

function changeBackgroundBasedOnTemperature(temperature) {
    var cardContainer = document.getElementById('cardContainer');
    cardContainer.classList.remove('hot-background', 'cold-background', 'default-background');

    if (temperature >= 25) {
        cardContainer.classList.add('hot-background');
    } else if (temperature <= 10) {
        cardContainer.classList.add('cold-background');
    } else {
        cardContainer.classList.add('default-background');
    }
}
