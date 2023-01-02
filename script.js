let weatherUrl;
let locationUrl;
let jsonData = [];
let locationData = [];
let longitude;
let latitude;
let requestType;
const status = document.getElementById("status");
const weathericon = document.getElementById("weathericon");

function buildAPIRequestUsingLocationData(position) {
        requestType = "location";
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=5ecabb000a89eb6a1a32b5113457f4a0&units=imperial";
        locationUrl = "https://www.mapquestapi.com/geocoding/v1/reverse?key=VGmsY3ZpSNBA8mWlqtnlczWYmlgm1RuM&location=" + latitude + "," + longitude;
        weatherAPIRequest();
    } 

function buildAPIRequestUsingCity() {
    requestType = "cityname"
    let city = document.getElementById("cityname").value;
    let state = document.getElementById("statename").value;
    locationUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=VGmsY3ZpSNBA8mWlqtnlczWYmlgm1RuM&location=" + city + "," + state;
    fetch(locationUrl).then(response => response.json()).then(json => {
        locationData.push(json);
        document.getElementById("city").innerHTML = locationData[0].results[0].locations[0].adminArea5 + ", " + locationData[0].results[0].locations[0].adminArea3;
        latitude = locationData[0].results[0].locations[0].latLng.lat;
        longitude = locationData[0].results[0].locations[0].latLng.lng;
        weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=5ecabb000a89eb6a1a32b5113457f4a0&units=imperial";
        weatherAPIRequest();
    });
}

function weatherAPIRequest() {
    if (requestType == "location") {
        fetch(weatherUrl).then(response => response.json()).then(json => {
            jsonData.push(json);
            displayTempData();
        })
        fetch(locationUrl).then(response => response.json()).then(json => {
            locationData.push(json);
            document.getElementById("city").innerHTML = locationData[0].results[0].locations[0].adminArea5 + ", " + locationData[0].results[0].locations[0].adminArea3;
        });
    } else {
        fetch(weatherUrl).then(response => response.json()).then(json => {
            jsonData.push(json);
            displayTempData();
        })
    }
}

function displayTempData() {
    let temperature = Math.round(jsonData[0].main.temp)
    let humidity = Math.round(jsonData[0].main.humidity)
    document.getElementById('temp').innerHTML = temperature + "°F";
    document.getElementById("humidity").value = humidity;
    document.getElementById("humiditytext").innerHTML = "Humidity: " + humidity;
    // add a current time feature
    setStatus(jsonData[0].weather.id);
}

function setStatus(x) {
    // reminder: add a for loop somewhere
    switch (x) {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
            // use setStyleBasedOnWeather() to set bg or something
            document.getElementById("status").innerHTML = "Thunderstorms";
            setStyleBasedOnWeather("thunderstorm");
            break;
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
    }
}

function setStyleBasedOnWeather(weather) {
    // to fulfill perf task question later on
    if (weather == "clear") {
        document.getElementById("weathericon").src = "https://img.icons8.com/stickers/100/null/summer.png";
    } else if (weather == "cloudy") {
        weathericon.src = "https://img.icons8.com/stickers/100/null/partly-cloudy-day.png"
    }
}


//navigator.geolocation.getCurrentPosition(buildAPIRequestUsingLocationData)