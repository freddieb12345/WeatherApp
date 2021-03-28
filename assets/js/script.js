const userInputEl = document.getElementById("city-input");
const searchButtonEl = document.getElementById("search-button");
const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind-speed");
const uvEl = document.getElementById("UV-index");

const APIKey = "73e080bd08077adb9fa1fd1d913233fc";
var searchHistory = JSON.parse(localStorage.getItem("input")) || [];

function searchCity(cityName) {
    console.log("hi");
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    fetch(requestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            //Display city name and date
            console.log(data);
            const currentDate = new Date(data.dt*1000);
            console.log(currentDate);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            cityNameEl.textContent = data.name + ' - ' + day + '/' + month + '/' + year;
            //Display temperature in celsius
            var tempCelsius = Math.round(data.main.temp - 273); 
            tempEl.textContent = 'Temperature - ' + tempCelsius + '°C';
            //Display Humidity
            humidityEl.textContent = 'Humidity - ' + data.main.humidity + '%';

        })
}

searchButtonEl.addEventListener("click",function(){
    const userInput = userInputEl.value;
    console.log(userInput);
    searchCity(userInput);
    searchHistory.push(userInput);
    localStorage.setItem("input", JSON.stringify(searchHistory));
    console.log(searchHistory);
});