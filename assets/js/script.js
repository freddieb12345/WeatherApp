//Getting elements by their ID
const userInputEl = document.getElementById("user-input");
const searchButtonEl = document.getElementById("search-button");
const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind-speed");
const uvEl = document.getElementById("UV-index");
const searchHistoryEl = document.getElementById("history");
const clearHistoryBtn = document.getElementById("clear-history")
const imgEl = document.getElementById("current-img");


const APIKey = "73e080bd08077adb9fa1fd1d913233fc";
var searchHistory = JSON.parse(localStorage.getItem("input")) || []; //Defining search history as a the input value in localStorage, or failing that, and empty array.

//Function that executes the search for the cities weather
function searchCity(cityName) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    
    fetch(requestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            //Display city name and date
            console.log(data);
            const currentDate = new Date(data.dt*1000);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            cityNameEl.textContent = data.name + ' - ' + day + '/' + month + '/' + year;
            //Display picture
            var weatherImg = data.weather[0].icon;
            imgEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
            imgEl.setAttribute("alt", data.weather[0].description);
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
    //Fetching seperate API for the UV index
    fetch("https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            console.log(data);
            //Creating UV index element
            uvEl.textContent = 'UV Index - ';
            var UVIndex = document.createElement("span");
            currentUVindex = data[0].value;
            UVIndex.innerHTML = currentUVindex;
            uvEl.append(UVIndex);
            //Formatting UV index element depending on its severity
            if(currentUVindex < 2){
                UVIndex.setAttribute("class","badge badge-success")
            }
            else if (currentUVindex > 8) {
                UVIndex.setAttribute("class","badge badge-danger")
            }
            else{
                UVIndex.setAttribute("class","badge badge-warning")
            }
    //Fetching seperate API for the 5 day forecast   
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var forecastElements = document.querySelectorAll(".forecast"); //Selectss all elements with the class 'forecast'
            for(var i =0; i < forecastElements.length ; i++){ //Creates elements equal to the number of elements selected above
                forecastElements[i].innerHTML = ""; //Clears the elements initially
                //Gets date of forecast and appends it to elements
                const forecastIndex = i*8 + 4; //Selects 9am every morning to take the forecast
                const forecastDate = new Date(data.list[forecastIndex].dt*1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear()
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.textContent = forecastDay + '/' + forecastMonth + '/' + forecastYear;
                forecastElements[i].append(forecastDateEl);
                //Gets corresponding img for the weather and appends it to the elements
                const forecastImgEl = document.createElement("img");
                forecastImgEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastImgEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                forecastElements[i].append(forecastImgEl);
                //Gets forecast temps and appends them to the elements
                const forecastTempEl = document.createElement("p");
                const tempCelsiusI = Math.round(data.list[forecastIndex].main.temp - 273)
                forecastTempEl.textContent = "Temp: " + tempCelsiusI + '°C';
                forecastElements[i].append(forecastTempEl);
                //Gets forecast Humdity and appends them to the elements
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.textContent = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                forecastElements[i].append(forecastHumidityEl);
            }
        })
        })
    })
}

//Function to load the search history to the page 
function loadSearchHistory() {
    searchHistoryEl.innerHTML = ""; //Clears the search history element initially
    //loops through the searchhistory element and prints each result to the element
    for (var i = 0; i < searchHistory.length; i++) {
        const historyResult = document.createElement("input");
        historyResult.setAttribute("type", "text");
        historyResult.setAttribute("readonly",true);
        historyResult.setAttribute("class","form-control d-block bg-white");
        historyResult.setAttribute("value", searchHistory[i]);
        
        //Makes search history clickable to quickly search for cities that have previously been searched
        historyResult.addEventListener("click",function() {
            searchCity(historyResult.value);
        })
        searchHistoryEl.append(historyResult); //Appends the history results to the search history element
    }
}

//Creates function that activates when search button is clicked
searchButtonEl.addEventListener("click",function(){
    const userInput = userInputEl.value; 
    /* console.log(userInput); */
    searchCity(userInput);
    searchHistory.push(userInput);
    localStorage.setItem("input", JSON.stringify(searchHistory));
    /* console.log(searchHistory); */
    loadSearchHistory();
});

//Creates clear history button functionallity
clearHistoryBtn.addEventListener("click", function() {
    searchHistory = [];
    loadSearchHistory();
})

//Loads last search city on page load
loadSearchHistory();
if(searchHistory.length > 0) {
    searchCity(searchHistory[searchHistory.length -1]);
}