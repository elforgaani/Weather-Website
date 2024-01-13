const baseUrl = "http://api.weatherapi.com/v1/";
const apiKey = "39cf6c5f56264399a9473545240901";
const searchInput = document.getElementById("search-input-field");
const body = document.getElementById("main-body");
const searchBtn = document.getElementById("search-button");
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

searchBtn.addEventListener("click", () =>
  searchInput.value
    ? getWeatherData(null, null, searchInput.value)
    : alert("Enter City Name!!")
);

function getLocation() {
  const geoLocator = navigator.geolocation;
  return new Promise((resolve, reject) => {
    if (!"geolocation" in navigator) {
      alert(
        "Your device doesn't support location, default locatoin will be used!"
      );
    }
    geoLocator.getCurrentPosition(
      (position) =>
        resolve([position.coords.latitude, position.coords.longitude]),
      (e) => reject(e)
    );
  });
}

getLocation()
  .then((coords) => getWeatherData(coords, null, null))
  .catch((e) => console.log(e));
async function getWeatherData(coords, e = null, city) {
  let weatherData = "";
  let q = "";

  if (e) {
    alert("Something wrong with your location, default location will be used!");
  }
  try {
    if (city) {
      q = city;
    }
    if (coords) {
      q = `${coords[0]},${coords[1]}`;
    }
    console.log(q);

    const resp = await fetch(
      `${baseUrl}forecast.json?key=${apiKey}&q=${q}&days=3`
    );
    const weatherResult = await resp.json();
    // console.log(weatherResult)
    const forecasts = weatherResult.forecast.forecastday;
    console.log(forecasts);

    forecasts.forEach((element) => {
      const day = new Date(element.date);
      weatherData += `  <div class="col-md-4">
            <div class="weather-box rounded-3">
              <div class="location-info d-flex justify-content-between px-4">
                <h6>${weekDays[day.getDay()]}</h6>
                <span>${element.date}</span>
              </div>
              <div class="weather-info d-flex flex-column justify-content-center align-items-center">
                <div
                  class="temperature-info d-flex justify-content-center align-items-center px-2"
                >
                  <span>${element.day.avgtemp_c}°</span>
                  <div class="weather-icon">
                    <img
                      src="https:${element.day.condition.icon}"
                      alt="Weather Icon"
                    />
                  </div>
                </div>
                <span class="text-primary">${element.day.condition.text}</span>
              </div>
            </div>
          </div>`;
    });

    body.innerHTML = weatherData;
  } catch (e) {
    alert(e);
  }
}
