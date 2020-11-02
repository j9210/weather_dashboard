// DOM Elements
var cityInputEl = document.querySelector("#city-input");
var searchBtnEl = document.querySelector("#searchBtn");
var currentWeatherEl = document.querySelector("#currentWeather");
var forecastEl = document.querySelector("#forecast");
var searchFormEl = document.querySelector("#Search");
var searchHistEl = document.querySelector("#history");

//let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const apiKey = "250c7916cd74196dd34384d69323c6b6";


// Create a search function for the city
var formSubmitHandler = (event) => {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    // check the response if else
    if (city) {
        getCurrentWeather(city); 
        getForecast(city);
        createSearchList(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city.")
    }
    localStorage.setItem("search",JSON.stringify(createSearchList));
}

// Create a search function that works on the searched 
var findCity = (event) => {
    var city = event.target.textContent;
    getCurrentWeather(city);
    getForecast(city);
}


var createSearchList = (city) => {
    // Check if city already listed
    children = searchHistEl.children
    for (i=0; i < children.length; i++) {
        // break function if true
        if (city === children[i].textContent) {
            return;
        }
    }
    //add searched city to search history div
    var cityEl = document.createElement("button");
    cityEl.textContent = city;
    searchHistEl.appendChild(cityEl);

    city.onclick = findCity;
}
// Get City Weather Info
 var getCurrentWeather = (city) => {
     console.log(city);
     var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
     fetch(apiUrl).then((response) => {
         if (response.ok) {
             response.json().then((data) => {
                 displayCurrentWeather(data, city);
                 createSearchList(city);
            
             })
         } else {
             alert("Error: " + response.statusText);
         }
     });
 }

// Get forecast info
var getForecast = (city) => {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(forecastUrl).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                displayForecast(city);
            })
        }
    })
}

// displayCurrentWeather Function
var displayCurrentWeather = (data,city) => {
    //while (currenWeatherEl.firstChild) {
        //currenWeatherEl.removeChild(todayEl.firstChild);
    

    // create var for city name, temp, humidity, windspeed, and UV
    var city = data.name
    var temp = data.main.temp;
    var humidity= data.main.humidity;
    var wind = data.wind.speed;

    // create DOM els
    var nameEl = document.createElement("h2");
    var date = moment().format('L');
    var icon = document.createElement("img");
    nameEl.textContent = city + " (" + date + ")";

    // find icon and attach to city and date
    icon.setAttribute("src", "http://openweathermap.org/img/wn" + data.weather[0].icon + ".png");
    nameEl.appendChild(icon);
    currentWeatherEl.appendChild(nameEl);

    // DOM Els for temp, humidity, and windspd
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + temp + "\u00B0F";
    currentWeatherEl.appendChild(tempEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    currentWeatherEl.appendChild(humidityEl);

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind Speed: " + wind + " MPH";
    currentWeatherEl.appendChild(windSpeedEl);

    // get lat and lon for UV index
    lat = data.coord.lat;
    lon = data.coord.lon;

    // fetch request for UV index info
    var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" +lat + "&lon="+ lon + "&appid=" + apiKey;
    fetch(uvUrl).then((response2) => {
        response2.json().then((data) => {
            var uv = data.value;
            var uvEl = document.createElement("p");
            uvEl.innerHTML = "<p>UV Index: <span>" + uv + "</span></p>";

            // set favorable, moderate, severe rating
            if (uv < 3) {
                $("#uv").className = "favorable"
            } 
            else if (uv < 6) {
                $("#uv").className = "moderate"
            }

            else{
                $("#uv").className = "severe"
            }

            currentWeatherEl.appendChild(uvEl);
        });
    })

}

// Display Infor for 5 day forecast
var displayForecast = (data,city) => {
    // clear old content

    // create counter to keep track of date
    j = 1;
    for (i = 3; i< 36; i+=8){
        // create variables for the date temp humidity and icon
        var date = moment().add(j,'day').format("L");
        var icon = document.createElement("img");
        icon.setAttribute("src","http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png")

        temp = data.list[i].main.temp;
        humidity = data.list[i].main.humidity;

        // create cards for 5 day forecast
        cardEl = document.createElement("div");
        cardEl.className= "card";

        // DOM Els for the vars
        dateEl = document.createElement("h6");
        dateEl.textContent = date;
        tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + temp + "\u00B0F";
        humidityEl = document.createElement("p")
        humidityEl.textContent = "Humidity: " + humidity + "%";

        //appendages
        cardEl.appendChild(dateEl);
        cardEl.appendChild(icon);
        cardEl.appendChild(tempEl);
        cardEl.appendChild(humidityEl);
        forecastEl.appendChild(cardEl);

        j++
    }
}



searchBtnEl.addEventListener("click", formSubmitHandler);