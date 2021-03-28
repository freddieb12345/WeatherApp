const userInputEl = document.getElementById("city-input");
const searchButtonEl = document.getElementById("search-button");
const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind-speed");
const uvEl = document.getElementById("UV-index");
const searchHistoryEl = document.getElementById("history");
const clearHistoryBtn = document.getElementById("clear-history")

const APIKey = "73e080bd08077adb9fa1fd1d913233fc";
var searchHistory = JSON.parse(localStorage.getItem("input")) || [];

function searchCity(cityName) {
    /* console.log("hi"); */
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    
    fetch(requestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            //Display city name and date
            /* console.log(data); */
            const currentDate = new Date(data.dt*1000);
            /* console.log(currentDate); */
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            cityNameEl.textContent = data.name + ' - ' + day + '/' + month + '/' + year;
            //Display temperature in celsius
            var tempCelsius = Math.round(data.main.temp - 273); 
            tempEl.textContent = 'Temperature - ' + tempCelsius + '°C';
            //Display Humidity
            humidityEl.textContent = 'Humidity - ' + data.main.humidity + '%';
            //Display Wind speed
            var windMph = Math.round(data.wind.speed * 2.23694);
            /* console.log(data.wind.speed); */
            windEl.textContent = 'Wind-speed - ' + windMph + 'mph';
            //Create variables for latitude and longitude to use in the UV API
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            /* console.log(latitude);
            console.log(longitude); */
            /* searchUVIndex(latitude,longitude); */
    fetch("https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            console.log(data);
            uvEl.textContent = 'UV Index - ';
            var UVIndex = document.createElement("span");
            currentUVindex = data[0].value;
            UVIndex.innerHTML = currentUVindex;
            uvEl.append(UVIndex);
            if(currentUVindex < 2){
                UVIndex.setAttribute("class","badge badge-success")
            }
            else if (currentUVindex > 8) {
                UVIndex.setAttribute("class","badge badge-danger")
            }
            else{
                UVIndex.setAttribute("class","badge badge-warning")
            }   
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var forecastElements = document.querySelectorAll(".forecast");
            for(var i =0; i < forecastElements.length ; i++){
                forecastElements[i].innerHTML = "";
                const forecastIndex = i*8 + 4; //Selects 9am every morning to take the forecast
                const forecastDate = new Date(data.list[forecastIndex].dt*1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear()
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.textContent = forecastDay + '/' + forecastMonth + '/' + forecastYear;
                forecastElements[i].append(forecastDateEl);

                const forecastImgEl = document.createElement("img");
                forecastImgEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastImgEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                forecastElements[i].append(forecastImgEl);

                const forecastTempEl = document.createElement("p");
                const tempCelsiusI = Math.round(data.list[forecastIndex].main.temp - 273)
                forecastTempEl.textContent = "Temp: " + tempCelsiusI + '°C';
                forecastElements[i].append(forecastTempEl);

                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.textContent = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                forecastElements[i].append(forecastHumidityEl);
            }
        })
        })
    })
}

function loadSearchHistory() {
    searchHistoryEl.innerHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        const historyResult = document.createElement("input");
        historyResult.setAttribute("type", "text");
        historyResult.setAttribute("readonly",true);
        historyResult.setAttribute("class","form-control d-block bg-white");
        historyResult.setAttribute("value", searchHistory[i]);
        
        historyResult.addEventListener("click",function() {
            searchCity(historyResult.value);
        })
        searchHistoryEl.append(historyResult);
    }
}

searchButtonEl.addEventListener("click",function(){
    const userInput = userInputEl.value;
    /* console.log(userInput); */
    searchCity(userInput);
    searchHistory.push(userInput);
    localStorage.setItem("input", JSON.stringify(searchHistory));
    /* console.log(searchHistory); */
    loadSearchHistory();
});

clearHistoryBtn.addEventListener("click", function() {
    searchHistory = [];
    loadSearchHistory();
})

loadSearchHistory();
if(searchHistory.length > 0) {
    searchCity(searchHistory[searchHistory.length -1]);
}