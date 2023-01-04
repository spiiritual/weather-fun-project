let weatherUrl;
let locationUrl;
let jsonData = [];
let locationData = [];
let longitude;
let latitude;
let requestType;
const description = document.getElementById("description");
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
    let temperature = Math.round(jsonData[0].main.temp);
    let humidity = Math.round(jsonData[0].main.humidity);
    document.getElementById('temp').innerHTML = temperature + "°F";
    document.getElementById("humidity").value = humidity;
    document.getElementById("humiditytext").innerHTML = "Humidity: " + humidity;
    document.getElementById("status").innerHTML = jsonData[0].weather[0].main;
    setDescription(jsonData[0].weather.id);
}

function setDescription(x) {
    // idea for a for loop: use a for loop to set an image for bg AND for setstylebasedonweather
    if (x >= 200 && x <= 299) {
        switch (x) {
            case 200:
                description.innerHTML = "Thunderstorms with Light Rain";
                break;
            case 201:
                description.innerHTML = "Thunderstorms with Rain";
                break;
            case 202:
                description.innerHTML = "Thunderstorms with Heavy Rain";
                break;
            case 210:
            case 211:
            case 212:
            case 221:
                description.innerHTML = "Thunderstorms";
                break;
            case 230:
            case 231:
            case 232:
                description.innerHTML = "Drizzling Thunderstorms";
                break;
        }
    } else if (x >= 300 && x <= 399) {
        switch (x) {
            case 300:
            case 310:
                description.innerHTML = "Light Drizzling";
                break;
            case 301:
            case 311:
                description.innerHTML = "Drizzling";
                break;
            case 302:
            case 312:
                description.innerHTML = "Heavy Drizzling";
                break;
            case 313:
                description.innerHTML = "Shower Rain and Drizzle";
                break;
            case 314:
                description.innerHTML = "Heavy Shower Rain and Drizzle";
                break;
            case 321:
                description.innerHTML = "Shower Drizzle";
                break;
        }
    } else if (x >= 400 && x <= 499) {
        switch (x) {
            case 500:
                description.innerHTML = "Light Rain";
                break;
            case 501:
                description.innerHTML = "Rain";
                break;
            case 502:
            case 503:
                description.innerHTML = "Heavy Rain";
                break;
            case 504:
                description.innerHTML = "Extreme Rain";
                break;
            case 511:
                description.innerHTML = "Freezing Rain";
                break;
            case 520:
                description.innerHTML = "Light Showers";
                break;
            case 521:
                description.innerHTML = "Showers";
                break;
            case 522:
            case 531:
                description.innerHTML = "Heavy Showers";
                break;
        }
    } else if (x >= 600 && x <= 699) {
        switch (x) {
            case 600:
                description.innerHTML = "Light Snow";
                break;
            case 601:
                description.innerHTML = "Snow";
                break;
            case 602:
                description.innerHTML = "Heavy Snow";
                break;
            case 611:
                description.innerHTML = "Sleet";
                break;
            case 612:
                description.innerHTML = "Light Showers and Sleet";
                break;
            case 613:
                description.innerHTML = "Showers and Sleet";
                break;
            case 615:
                description.innerHTML = "Light Rain and Snow";
                break;
            case 616:
                description.innerHTML = "Rain and Snow";
                break;
            case 620:
                description.innerHTML = "Light Showers and Snow";
                break;
            case 621:
                description.innerHTML = "Showers and Snow";
                break;
            case 622:
                description.innerHTML = "Heavy Showers and Snow";
                break;
        }
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


