// DOM Elements
var cityInputEl = document.querySelector("#city-input");
var searchBtnEl = document.querySelector("#searchBtn");
var currentWeatherEl = document.querySelector("#currentWeather");
var forecastEl = document.querySelector("#forecast");
var searchFormEl = document.querySelector("#Search");
var searchHistEl = document.querySelector("#history");
var historyArr = JSON.parse(localStorage.getItem("history")) || [];



const apiKey = "250c7916cd74196dd34384d69323c6b6";


// Create a search function for the city
var formSubmitHandler = (event) => {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    // check the response if else
    if (city) {
        getCurrentWeather(city); 
        generateForecast(city);
        createSearchList(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city.")
    }
    console.log(localStorage.searchFormEl);
}

// Create a search function that works on the searched
$(".search-history").on("click", "li", function(){
    console.log($(this).text())
    getCurrentWeather($(this).text());
    generateForecast($(this).text());
}) 


var createSearchList = (city) => {
    var list = $("#history");
    var item = $("<li>").addClass("list-group-item");
    item.text(city);
    list.append(item)
}

// save search list
// var saveSearchList = 
// Get City Weather Info
 var getCurrentWeather = (city) => {
     console.log(city);
     var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
     fetch(apiUrl).then((response) => {
            console.log(historyArr)
        if(historyArr.indexOf(city) === -1){
            
            historyArr.push(city);
            localStorage.setItem("history", JSON.stringify(historyArr))

        }

         if (response.ok) {
             response.json().then((data) => {
                 displayCurrentWeather(data, city);
            
             })
         } else {
             alert("Error: " + response.statusText);
         }
     });
 }



// displayCurrentWeather Function
var displayCurrentWeather = (data,city) => {
    currentWeatherEl.innerHTML = "";
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
    var tempEl = document.createElement("h3");
    tempEl.textContent = "Temperature: " + temp + "\u00B0F";
    currentWeatherEl.appendChild(tempEl);

    var humidityEl = document.createElement("h3");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    currentWeatherEl.appendChild(humidityEl);

    var windSpeedEl = document.createElement("h3");
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
            var uvEl = document.createElement("h3");
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
var generateForecast = (city) => {
   var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
   fetch(forecastUrl).then((result) => result.json())
   .then((data) => {
    var forecast = document.querySelectorAll(".forecast");
    
    for (i = 0; i < forecast.length; i++) {
        let h1El = document.createElement("h1");
        h1El.setAttribute("class", "forecast-h1");
        h1El.textContent = "5 Day Forecast";

        forecast[i].appendChild(h1El);
        forecast[i].innerHTML = "";
        var forecastIndex = i * 8 + 4;
        // console.log(fiveDayIndex);
        var forecastDate = new Date(data.list[forecastIndex].dt * 1000);
        var forecastYear = forecastDate.getFullYear();
        var forecastMonth = forecastDate.getMonth() + 1;
        var forecastDay = forecastDate.getDate();
        
        var forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class", "forecast-p");

        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        console.log(forecastDateEl);
        forecast[i].append(forecastDateEl);

        var forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
        
        forecast[i].append(forecastWeatherEl);

        var forecastTemperatureEl = document.createElement("p");
        forecastTemperatureEl.setAttribute("class", "f-temp-p");
        forecastTemperatureEl.innerHTML = "Temp: " + (data.list[forecastIndex].main.temp) + "\u00B0F";
        forecast[i].append(forecastTemperatureEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.setAttribute("class", "f-humid-p");
        forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
        forecast[i].append(forecastHumidityEl);
    }

   })
};

for (let i = 0; i < historyArr.length; i++) {
    createSearchList(historyArr[i])
    
}

searchBtnEl.addEventListener("click", formSubmitHandler);