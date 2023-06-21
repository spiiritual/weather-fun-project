// Variables for code
let jsonData = [];
let locationData = [];
let stage = 0;
const mapquest_url = "https://www.mapquestapi.com/geocoding/v1/address?"; // City and State data by Mapquest
const weather_url = "https://api.openweathermap.org/data/2.5/weather?"; // Weather data by OpenWeatherMap
const mapquest_api_key = "INSERT_API_KEY";
const weather_api_key = "INSERT_API_KEY";

function locationDataAPI(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  locationData = [];
  jsonData = [];
  document.getElementById("overlay").style.display = "flex";
  weatherAPIRequest("location", latitude, longitude)
}

function cityDataAPI() {
  let city = (document.getElementById("cityname").value).replace(/\s+/g, '');
  let state = document.getElementById("statename").value;
  locationData = [];
  jsonData = [];
  document.getElementById("overlay").style.display = "flex";
  fetch(mapquest_url + new URLSearchParams({
    key: mapquest_api_key,
    location: `${city},${state},USA`
  })).then(response => response.json()).then(json => {
    locationData.push(json);
    weatherAPIRequest("city", locationData[0].results[0].locations[0].latLng.lat, locationData[0].results[0].locations[0].latLng.lng);
  })
}

function weatherAPIRequest(request_type, latitude, longitude) {
  if (request_type == "location") {
    fetch(weather_url + new URLSearchParams({
      lat: latitude,
      lon: longitude,
      appid: weather_api_key,
      units: "imperial"
    })).then(response => response.json()).then(json => {
      jsonData.push(json);
      loadLocationAndTempData(request_type)
    });
    fetch(mapquest_url + new URLSearchParams({
      key: mapquest_api_key,
      location: `${latitude},${longitude}`
    })).then(response => response.json()).then(json => {
      locationData.push(json);
      loadLocationAndTempData(request_type)
    })
  } else if (request_type == "city") {
    fetch(weather_url + new URLSearchParams({
      lat: latitude,
      lon: longitude,
      appid: weather_api_key,
      units: "imperial"
    })).then(response => response.json()).then(json => {
      jsonData.push(json);
      loadLocationAndTempData(request_type)
    })
  }
}

function displayTempData() {
  const humidity = Math.round(jsonData[0].main.humidity);
  const temperature = Math.round(jsonData[0].main.temp);
  const feels_like = Math.round(jsonData[0].main.feels_like);
  const city = locationData[0].results[0].locations[0].adminArea5;
  const state = locationData[0].results[0].locations[0].adminArea3;

  document.getElementById("temp").innerHTML = `${temperature}°F`;
  document.getElementById("feelslike").innerHTML = `Feels like: ${feels_like}°F`;
  document.getElementById("humiditytext").innerHTML = `Humidity: ${humidity}`;
  document.getElementById("city").innerHTML = `${city}, ${state}`;
  document.getElementById("overlay").style.display = "none";

  setDescription(jsonData[0].weather[0].id);
  setStyleBasedOnWeather(jsonData[0].weather[0].main);
  displayExtremeWeatherWarning(jsonData[0].weather[0].main);
}

function setDescription(id) {
  const description = document.getElementById("description");
  const possible_descriptions = [
    { id: 2, description: "Click Earth to find out the weather!" },
    { id: 200, description: "Thunderstorms with Light Rain" },
    { id: 201, description: "Thunderstorms with Rain" },
    { id: 202, description: "Thunderstorms with Heavy Rain" },
    { ids: [210, 211, 212, 221], description: "Thunderstorms" },
    { ids: [230, 231, 232], description: "Drizzling Thunderstorms" },
    { ids: [300, 310], description: "Light Drizzling" },
    { ids: [301, 311], description: "Drizzling" },
    { ids: [302, 312], description: "Heavy Drizzling" },
    { id: 313, description: "Shower Rain and Drizzle" },
    { id: 314, description: "Heavy Shower Rain and Drizzle" },
    { id: 321, description: "Shower Drizzle" },
    { id: 500, description: "Light Rain" },
    { id: 501, description: "Rain" },
    { ids: [502, 503], description: "Heavy Rain" },
    { id: 504, description: "Extreme Rain" },
    { id: 511, description: "Freezing Rain" },
    { id: 520, description: "Light Showers" },
    { id: 521, description: "Showers" },
    { ids: [522, 531], description: "Heavy Showers" },
    { id: 600, description: "Light Snow" },
    { id: 601, description: "Snow" },
    { id: 602, description: "Heavy Snow" },
    { id: 611, description: "Sleet" },
    { id: 612, description: "Light Showers and Sleet" },
    { id: 613, description: "Showers and Sleet" },
    { id: 615, description: "Light Rain and Snow" },
    { id: 616, description: "Rain and Snow" },
    { id: 620, description: "Light Showers and Snow" },
    { id: 621, description: "Showers and Snow" },
    { id: 622, description: "Heavy Showers and Snow" },
    { id: 701, description: "Mist" },
    { id: 711, description: "Smoke" },
    { id: 721, description: "Haze" },
    { id: 731, description: "Sand Swirls" },
    { id: 741, description: "Fog" },
    { id: 751, description: "Sand" },
    { id: 761, description: "Dust" },
    { id: 762, description: "Volcanic Ash" },
    { id: 771, description: "Squalls" },
    { id: 781, description: "Tornadoes" },
    { id: 800, description: "Clear Skies" },
    { id: 801, description: "Slight Cloudiness" },
    { id: 802, description: "Partly Cloudy" },
    { id: 803, description: "Mostly Cloudy" },
    { id: 804, description: "Cloudy" },
  ];

  for (let i = 0; i < possible_descriptions.length; i++) {
    if (possible_descriptions[i].id == id) {
      description.innerHTML = possible_descriptions[i].description
    } else if (possible_descriptions[i].ids == id) {
      description.innerHTML = possible_descriptions[i].description
    }
  }
}

function setStyleBasedOnWeather(weather) {
  const weathericon = document.getElementById("weathericon");
  const body = document.getElementById("body");
  weathericon.style.display = "block";
  // All icons by Icons8
  if (weather == "Clear") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/summer.png"
  } else if (weather == "Clouds") {
    const weather_code = jsonData[0].weather[0].id;
    if (weather_code == 801 || weather_code == 802) {
      weathericon.src = "https://img.icons8.com/stickers/100/null/partly-cloudy-day.png";
    } else if (weather_code == 803 || weather_code == 804) {
      weathericon.src = "https://img.icons8.com/stickers/100/null/cloud--v1.png";
    }
    body.style.backgroundImage = 'url("https://i.imgur.com/LieJSsQ.jpeg")'
  } else if (weather == "Thunderstorm") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/storm.png"
    body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1551234250-d88208c2ce14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1931&q=80")' // Photo by Michael D on Unsplash
  } else if (weather == "Partly Cloudy") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/partly-cloudy-day.png"
  } else if (weather == "Snow") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/snowflake.png";
    body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1208&q=80")' // Photo by Adam Chang on Unsplash
  } else if (weather == "Fog") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/fog-night.png"
  } else if (weather == "Tornado") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/tornado.png"
  } else if (weather == "Rain" || weather == "Drizzle") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/rain.png"
  } else if (weather == "Haze" || weather == "Mist") {
    weathericon.src = "https://img.icons8.com/stickers/100/null/fog-day.png"
  } else {
    weathericon.src = "https://img.icons8.com/stickers/100/null/wind.png"
  }
}

function setColorOfPanel(weather_code) {
  const possible_colors = [
    { min: 200, max: 232, color: 'rgba(99, 92, 96, 0.8)' },
    { min: 300, max: 321, color: 'rgba(137, 195, 229, 0.8)' },
    { min: 500, max: 531, color: 'rgba(1, 83, 212, 0.8)' },
    { min: 600, max: 622, color: 'rgba(238, 241, 245, 0.8)' },
    { min: 700, max: 781, color: 'rgba(214, 175, 175, 0.8)' },
    { min: 800, max: 800, color: 'rgba(255, 231, 96, 0.8)' },
    { min: 801, max: 804, color: 'rgba(255, 255, 255, 0.8)' }
  ];

  for (let i = 0; i < possible_colors.length; i++) {
    if (possible_colors[i].min <= weather_code && possible_colors[i].max >= weather_code) {
      document.getElementById("panel").style.backgroundColor = possible_colors[i].color
    }
  }
}

function displayExtremeWeatherWarning(weather) {
  
  const extreme_weather = ["Tornado", "Thunderstorms with Heavy Rain", "Heavy Snow", "Volcanic Ash", "Extreme Rain", "Heavy Showers and Snow", "Sand Swirls", "Squalls"];
  const warning = document.getElementById("warning");
  if (extreme_weather.includes(weather)) {
    warning.style.display = "block"
  } else {
    warning.style.display = "none"
  }
}

function randomB() {
  // An array of image URLs
  var images =
    ['https://www.tripsavvy.com/thmb/DftqPmjZUN3xf7NXWKuhM5rdv_o=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-470613027-57a6954a5f9b58974a8df90c.jpg', 'https://www.photographytalk.com/images/articles/2019/06/12/Landscape_Photography_Tips_for_Bad_Weather.jpg', 'https://cdn.visualwilderness.com/wp-content/uploads/2019/03/Four-peaks-snow-pano.jpg', 'https://contrastly.com/wp-content/uploads/bad-weather-1.jpg', 'https://cdn.fstoppers.com/media/2021/01/04/three_simple_landscape_photography_tips_for_shooting_in_grey_and_boring_weather_06.jpg', 'https://cdn.fstoppers.com/styles/full/s3/media/2018/08/21/bad_weather_landscape_photography_snowdonia_tryfan_0.jpg', 'https://ecophiles.com/wp-content/uploads/2017/05/Marble-Caves.jpg', 'http://cdn.cnn.com/cnnnext/dam/assets/190517092027-24-unusual-landscapes-travel.jpg', 'https://live.staticflickr.com/4349/36421874521_19c2b53a17_b.jpg', 'https://live.staticflickr.com/5692/23133599953_0e492e7323_b.jpg', 'https://www.telegraph.co.uk/content/dam/Travel/2018/August/Exmoor-National-Park-GettyImages-582466383.jpg', 'https://cdn.naturettl.com/wp-content/uploads/2016/06/22014547/top-10-landscapes-uk-ross-hoddinott-9.jpg', 'https://wallpaperaccess.com/full/114064.jpg'];
  var image = images[Math.floor(Math.random() * images.length)];
  document.getElementById('body').style.backgroundImage = "url('" + image + "')";
  document.getElementById('body').style.backgroundRepeat = "no-repeat";
  document.getElementById('body').style.backgroundSize = "cover";
}

function loadLocationAndTempData(request_type) {
  if (request_type == "location") {
    stage += 1;
    if (stage == 2) {
      displayTempData()
    }
  } else if (request_type == "city") {
    displayTempData()
  }
}

// Call the randomB function when the window finishes loading
//window.onload = function load() {
//    randomB();
//    setDescription(2);
//};

//setDescription("202")
//load()
