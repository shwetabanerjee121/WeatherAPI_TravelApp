document.addEventListener('DOMContentLoaded', function () {
    results.style.visibility='hidden';
    //const form = document.getElementById('weatherform');
    const btnsubmit = document.getElementById('btnsubmit');
    loadCitiesFromCSV();
    btnsubmit.addEventListener('click', function (e) {
        e.preventDefault();

        const city = document.getElementById('cities1');
        const lat = document.getElementById('latitude').value;
        const long = document.getElementById('longitude').value;

        console.log("Button active.");

        if (city.value != 'custom') {
            const [latd, longd] = city.value.split(',');
            fetchWeatherData(latd, longd);
            results.style.visibility='visible';
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `<h2 style="color: #441752"><i>Weather Details of the Selected City.</i></h2>`;
        } else if (lat && long) {
            fetchWeatherData(lat, long);
            resultsDiv.innerHTML = `<h2 style="color: #441752"><i>Weather Details of the Entered Coordinates.</i></h2>`;
        } else {
            displayError('Please select a city or enter coordinates.');
        }
    });

});

//Function to load cities from a CSV file
function loadCitiesFromCSV() {
    const cities1 = document.getElementById('cities1');
    Papa.parse('city_coordinates.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const cities = results.data;
            console.log('City list loaded:', cities); //Debugging log
            cities.forEach((city) => {
                const option = document.createElement('option');
                option.value = `${city.latitude},${city.longitude}`;
                option.textContent = city.city;
                console.log(option);
                cities1.appendChild(option);
            });
        },
        error: function (error) {
            console.error('Error loading CSV:', error);
            displayError('Failed to load city data.');
        },
    });
}

//Function to fetch weather data
async function fetchWeatherData(lat, long) {
    const url = `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civil&output=json`;
    try {
        console.log('Fetching weather data for: ')
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP error! Status: ${response.status}');

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError('Failed to fetch weather data.')
    }
}

//Function to display weather data
function displayWeatherData(data) {
    const resultsDiv = document.getElementById('results');
    if (data && data.dataseries) {
        data.dataseries.forEach((entry) => {
            const weatherItem = document.createElement('div');
            weatherItem.innerHTML = `
            <p><strong>Timepoint:</strong></p> ${entry.timepoint} hours</p>
            <p><strong>Temperature:</strong> ${entry.temp2m}°C</p>
            <p><strong>Weather:</strong> ${entry.weather}</p>
            `;
            resultsDiv.appendChild(weatherItem);
        });
    }
    else {
        displayError('No weather data found for the given coordinates.')
    }
}

//Function to display error messages
function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p class = "error">${message}</p>`;
}