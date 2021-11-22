// declarations
let openWeatherApiKey = "d860f678028955a533e55c6ec838d3b3";
let searchByCityList = [];
let city = "Minneapolis";
let currentDay = moment().format(" MM/DD/YYYY");

let savedCities = JSON.parse(localStorage.getItem("searchByCityList"));

weatherList(city);

if (savedCities != null) {
  searchByCityList = savedCities.slice();
  cityButtons();
}


$("#search-city").on("click", function (event) {
  event.preventDefault();
  city = $("#find-city").val().trim();
  if (city == "") {
    return;
  } else {
    weatherList(city);
  }
});

// create city buttons
function cityButtons() {
  $("#history-list").empty();
  for (let i = 0; i < searchByCityList.length; i++) {

    let a = $("<button>");
    a.addClass("svd-city-btn Collapsible");
    a.attr("data-name", searchByCityList[i]);
    a.text(searchByCityList[i]);
    $("#history-list").prepend(a);
  }
}

function weatherList(city) {
  $("#present").empty();
  $("#future").empty();

  queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    ",US&units=imperial&appid=" +
    openWeatherApiKey;
  forecastQueryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    ",US&units=imperial&appid=" +
    openWeatherApiKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      let weatherIcon = response.weather[0].icon;
      let iconLink = "http://openweathermap.org/img/wn/" + weatherIcon + ".png";

      let city = response.name;
      if (searchByCityList.indexOf(city) < 0) {
        if (searchByCityList.length >= 10) {
          searchByCityList.shift();
        }
        searchByCityList.push(city);
        localStorage.setItem(
          "searchByCityList",
          JSON.stringify(searchByCityList)
        );
        cityButtons();
      }
      let searchedCityDisplay = $("<div>");
      let cityName = response.name;
      let cityHeader = $("<h2>").text(cityName + " - " + currentDay);

      searchedCityDisplay.append(cityHeader);

      let iconEl = $("<img>").attr("src", iconLink);
      searchedCityDisplay.append(iconEl);

      let temp = Math.floor(response.main.temp);
      let pTemp = $("<p>").html("Temperature: " + temp + " &#8457;");
      searchedCityDisplay.append(pTemp);

      let humd = response.main.humidity;
      let pHumd = $("<p>").text("Humidity: " + humd + "%");
      searchedCityDisplay.append(pHumd);

      let windSpeed = response.wind.speed;
      let pWind = $("<p>").text("Wind Speed: " + windSpeed);
      searchedCityDisplay.append(pWind);


      searchedCityDisplay.append(pWind);
      $("#present").append(searchedCityDisplay);

      $.ajax({
        url: forecastQueryURL,
        method: "GET",
      })
      .then(function (forecast) {

        for (i = 0; i < 5; i++) {
          let k = 8 * i + 7;
          let forecastWeatherDisplay = $("<div class = 'col'>");
          let futureDate = new Date(forecast.list[k].dt_txt.substring(0, 10));
          let forcastDate = futureDate.getDate() + 1;
          let forecastDisplayMonth = futureDate.getMonth() + 1;
          let forcastDisplayYear = futureDate.getFullYear();
          let formattedDate = forecastDisplayMonth + "/" + forcastDate + "/" + forcastDisplayYear;
          let fDate = $("<p>").text(formattedDate);
          weatherIcon = forecast.list[k].weather[0].icon;
          iconLink = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
          forecastWeatherDisplay.append(fDate);

          iconEl = $("<img>").attr("src", iconLink);
          forecastWeatherDisplay.append(iconEl);

          let futureTemp = Math.floor(forecast.list[k].main.temp);
          let fTemp = $("<p>").html("Temperature: " + futureTemp + " &#8457;");
          forecastWeatherDisplay.append(fTemp);

          let futureHumidity = Math.floor(forecast.list[k].main.humidity);
          let formattedHumidity = $("<p>").text("Humidity: " + futureHumidity + "%");
          forecastWeatherDisplay.append(formattedHumidity);

          $("#future").append(forecastWeatherDisplay);
        }
      });
    });
}
// get weather for city in history list
$("#history-list").on("click", function (event) {
  city = event.target.textContent;
  weatherList(city);
});
