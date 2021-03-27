const userInputEl = document.getElementById("city-input");
const searchButtonEl = document.getElementById("search-button");
const APIKey = "73e080bd08077adb9fa1fd1d913233fc";
var searchHistory = JSON.parse(localStorage.getItem("input")) || [];

function searchCity() {
    console.log("hi");
}

searchButtonEl.addEventListener("click",function(){
    const userInput = userInputEl.value;
    console.log(userInput);
    searchCity(userInput);
    searchHistory.push(userInput);
    localStorage.setItem("input", JSON.stringify(searchHistory));
    console.log(searchHistory);
});