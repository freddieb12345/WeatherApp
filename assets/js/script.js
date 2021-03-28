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
            windEl.textContent = 'Wind-speed - ' + windMph + 'mph';
            //Create variables for latitude and longitude to use in the UV API
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            /* console.log(latitude);
            console.log(longitude); */
            /* searchUVIndex(latitude,longitude); */
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            /* console.log(data); */
            uvEl.textContent = 'UV Index - ';
            var UVIndex = document.createElement("span");
            currentUVindex = data.current.uvi;
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
                console.log(i+1);
                const forecastDate = new Date(data.list[i+1].dt*1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear()
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.textContent = forecastDay + '/' + forecastMonth + '/' + forecastYear;
                forecastElements[i].append(forecastDateEl);

                const forecastImgEl = document.createElement("img");
                forecastImgEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png");
                forecastImgEl.setAttribute("alt", data.list[i].weather[0].description);
                forecastElements[i].append(forecastImgEl);

                const forecastTempEl = document.createElement("p");
                const tempCelsiusI = Math.round(data.list[i].main.temp - 273)
                forecastTempEl.textContent = "Temp: " + tempCelsiusI + '°C';
                forecastElements[i].append(forecastTempEl);

                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";
                forecastElements[i].append(forecastHumidityEl);
            }
        })
        })
    })
}

/* function searchUVIndex(latitude,longitude){
    //Request seperate API data for UV index
    
} */
        


        

searchButtonEl.addEventListener("click",function(){
    const userInput = userInputEl.value;
    /* console.log(userInput); */
    searchCity(userInput);
    searchHistory.push(userInput);
    localStorage.setItem("input", JSON.stringify(searchHistory));
    /* console.log(searchHistory); */
});