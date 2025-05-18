let tempChartInstance; // Initialize chart instance

// Function to handle the search bar
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector(".search-bar");

  // Attach event listener to the form for search
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const city = document.querySelector("#search").value.trim();
      if (city !== "") {
        await getWeather(city);
      }
    });

    // Check if there's a city parameter in the URL
    const params = new URLSearchParams(window.location.search); // Get URL parameters
    const cityParam = params.get("city");

    if (cityParam) {
      document.querySelector("#search").value = cityParam;
      await getWeather(cityParam);
    } else {
      // Load default city if no city is provided in URL
      document.querySelector("#search").value = "College Park";
      await getWeather("College Park");
    }
  }

  // Load search history if on search-history.html
  if (window.location.pathname.endsWith("search-history.html")) {
    try {
      const res = await fetch("/api/get-history"); // Fetch search history
      const history = await res.json();

      const list = document.querySelector("#history-list");
      const emptyState = document.querySelector("#empty-state");
      const historyBox = document.querySelector(".history-box");
      const clearBtn = document.getElementById("clear-history-btn");

      // Check if the history list is empty
      if (history.length > 0) {
        if (emptyState) emptyState.style.display = "none"; // Hide empty state message
        if (historyBox) historyBox.classList.remove("history-box");
        if (clearBtn) clearBtn.style.display = "inline-flex"; // Show the clear button
      } else {
        if (emptyState) emptyState.style.display = "flex"; // Show empty state message
        if (clearBtn) clearBtn.style.display = "none"; // Hide the clear button
      }

      history.forEach((item) => {
        // Conditionally render state only if not a duplicate
        const displayState =
          item.state &&
          item.state.toLowerCase() !== item.city.toLowerCase() &&
          !item.state.toLowerCase().includes(item.city.toLowerCase() + " ")
            ? `, ${item.state}`
            : "";
        const fullDisplay = `${item.city}${displayState}, ${item.country}`;
        const li = document.createElement("li");
        li.className = "history-item";

        const span = document.createElement("span");
        const img = document.createElement("img");
        img.src = "icons/empty.svg";
        img.alt = "Search History Icon";
        span.appendChild(img);

        // Add the location text
        span.append(` ${fullDisplay}`);

        // Append span to list item
        li.appendChild(span);

        // Add click listener to redirect to weather page
        li.addEventListener("click", () => {
          window.location.href = `index.html?city=${encodeURIComponent(
            item.city
          )}`;
        });

        list.appendChild(li);
      });
    } catch (err) {
      console.error("Failed to load history:", err);
    }

    // Clear history functionality
    const clearBtn = document.getElementById("clear-history-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", async () => {
        try {
          const confirmed = confirm(
            "Are you sure you want to clear all history?"
          );
          if (!confirmed) return;

          const res = await fetch("/api/clear-history", {
            method: "DELETE",
          });

          if (res.ok) {
            // Clear from the HTML
            document.querySelector("#history-list").innerHTML = "";
            if (clearBtn) clearBtn.style.display = "none"; // Hide the button after clear
            const emptyState = document.querySelector("#empty-state");
            if (emptyState) emptyState.style.display = "block"; // Show empty state again
            alert("Search history cleared!");
          } else {
            const { error } = await res.json();
            console.error("Error clearing history:", error);
            alert("Failed to clear history.");
          }
        } catch (err) {
          console.error("Error:", err);
          alert("Something went wrong.");
        }
      });
    }
  }
});

// Function to fetch weather data
async function getWeather(city) {
  try {
    // Get latitude/longitude from city name using Open Meteo Geocoding API
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoRes.json();

    // Check if the response contains results
    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found!");
      return;
    }

    const result = geoData.results[0];
    const cityName = result.name;
    const rawState = result.admin1;
    const country = result.country;
    const { latitude, longitude } = result;

    // Avoid duplicate words: e.g. Lagos, Lagos or Oyo, Oyo State
    const state =
      rawState &&
      rawState.toLowerCase() !== cityName.toLowerCase() &&
      !rawState.toLowerCase().includes(cityName.toLowerCase() + " ")
        ? rawState
        : "";

    // Fetch weather data using Open Meteo Weather API
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&hourly=visibility,rain&daily=temperature_2m_max,temperature_2m_min,rain_sum,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&rain_unit=inch&timezone=auto`
    );

    const weatherData = await weatherRes.json();

    // Update the current weather and forecast sections
    updateCurrentWeather(cityName, state, country, weatherData);
    updateForecast(weatherData);
    updateCityMap(latitude, longitude, cityName, state, country); // Update the city map

    // Render temperature trend chart
    await renderTemperatureChart(latitude, longitude);

    // Save to history
    if (cityName.toLowerCase() !== "college park") {
      const saveRes = await fetch("/api/add-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityName, state, country }),
      });

      const result = await saveRes.json();
      console.log("Saved to history:", result);
    } else {
      console.log("Default city loaded. Not saved to history.");
    }
  } catch (err) {
    console.error("Error fetching weather data:", err);
  }
}

// Function to match Open-Meteo weather codes to Tomorrow.io icon names
function getIconName(code, isNight) {
  const mapping = {
    0: isNight ? "clear_night" : "clear_day",
    1: isNight ? "mostly_clear_night" : "mostly_clear_day",
    2: isNight ? "partly_cloudy_night" : "partly_cloudy_day",
    3: "mostly_cloudy",
    45: "fog",
    48: "fog_light",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "freezing_drizzle",
    57: "freezing_drizzle",
    61: "rain_light",
    63: "rain",
    65: "rain_heavy",
    66: "freezing_rain_light",
    67: "freezing_rain_heavy",
    71: "snow_light",
    73: "snow",
    75: "snow_heavy",
    77: "flurries",
    80: "rain_light",
    81: "rain",
    82: "rain_heavy",
    85: "snow_light",
    86: "snow_heavy",
    95: "tstorm",
    96: "tstorm",
    99: "tstorm",
  };
  return mapping[code] || "cloudy"; // Fallback to 'cloudy' if code is not found
}

// Function to update the current weather section
function updateCurrentWeather(city, state, country, data) {
  const current = data.current;

  const locationText = state
    ? `${city}, ${state}, ${country}`
    : `${city}, ${country}`;

  // Update the city and country
  document.querySelector("#city").innerHTML = `
    <img src="icons/location.svg" class="location-icon" /> ${locationText}
  `;

  // Update the city and country for the map
  document.querySelector("#map-city").innerHTML = `
    <img src="icons/location.svg" class="location-icon" /> ${locationText}
  `;

  // Update the current temperature to the nearest whole number
  document.querySelector("#temp").textContent = `${Math.round(
    current.temperature_2m
  )}°F`;

  // Update the humidity
  document.querySelector("#humidity").textContent =
    current.relative_humidity_2m !== undefined
      ? `${current.relative_humidity_2m}%`
      : "--";

  // Update the wind speed
  document.querySelector("#wind").textContent =
    current.wind_speed_10m !== undefined
      ? `${current.wind_speed_10m} mph`
      : "--";

  // Update the visibility (from hourly data)
  const currentHour = new Date().getHours();
  const visibility =
    data.hourly && data.hourly.visibility
      ? data.hourly.visibility[currentHour]
      : null;
  document.querySelector("#visibility").textContent =
    visibility !== null ? `${(visibility / 1609.34).toFixed(1)} mi` : "--";

  // Update the rain (from hourly data)
  const rain =
    data.hourly && data.hourly.rain ? data.hourly.rain[currentHour] : null;
  document.querySelector("#rain").textContent =
    rain !== null ? `${rain} in` : "--";

  // Get icon from the online GitHub repo
  const isNight = currentHour < 6 || currentHour > 18;
  const iconName = getIconName(current.weather_code, isNight);
  const iconUrl = `https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/V1_icons/color/${iconName}.svg`;

  const weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.src = iconUrl;
  weatherIcon.onerror = () => {
    weatherIcon.src = "icons/weather/cloudy.svg"; // Fallback to this icon if there's an error
  };
}

// Function to update the forecast section
function updateForecast(data) {
  const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Array of day names
  const daily = data.daily; // Get daily weather data
  const forecastElements = document.querySelectorAll(".forecast-grid .days"); // Get all forecast elements from the HTML

  forecastElements.forEach((forecastEl, index) => {
    const forecastDate = new Date(`${daily.time[index]}T12:00:00`); // Get the date from the daily data
    const forecastDayIndex = forecastDate.getDay(); // Get the day of week (adjusted for local city time)

    const label = allDays[forecastDayIndex]; // Get the day name from the array

    // Update the day label
    const dayLabel = forecastEl.querySelector("p");
    if (dayLabel) dayLabel.textContent = label;

    // Max and min temperatures
    const max = daily.temperature_2m_max[index]; // Get the max temperature
    const min = daily.temperature_2m_min[index]; // Get the min temperature
    const maxTemp = forecastEl.querySelector("#max-temp"); // Get the max temperature element from the HTML
    const minTemp = forecastEl.querySelector("#min-temp"); // Get the min temperature element from the HTML
    if (maxTemp) maxTemp.textContent = `${Math.round(max)}°`; // Update max temperature
    if (minTemp) minTemp.textContent = `${Math.round(min)}°`; // Update min temperature

    // Weather icon
    const code = daily.weather_code[index]; // Get the weather code
    const iconName = getIconName(code, false); // Get the icon name (daytime)
    const iconUrl = `https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/V1_icons/color/${iconName}.svg`; // Get the icon URL

    const forecastIcon = forecastEl.querySelector(".forecast-icon");
    if (forecastIcon) {
      forecastIcon.src = iconUrl;
      forecastIcon.onerror = () => {
        forecastIcon.src = "icons/weather/cloudy.svg"; // Fallback to cloudy if the icon fails to load
      };
    }
  });
}

// Function to render temperature trend chart
async function renderTemperatureChart(latitude, longitude) {
  try {
    const hourlyRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto`
    );
    const hourlyData = await hourlyRes.json();

    const hours = hourlyData.hourly.time.slice(0, 24);
    const temperatures = hourlyData.hourly.temperature_2m.slice(0, 24);

    const ctx = document.getElementById("tempChart").getContext("2d");
    if (tempChartInstance) tempChartInstance.destroy();

    tempChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: hours.map((time) => new Date(time).getHours() + ":00"),
        datasets: [
          {
            label: "Hourly Temp (°F)",
            data: temperatures,
            borderColor: "#2b9456",
            borderWidth: 2,
            fill: false,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#fff",
              font: { family: "Atkinson Hyperlegible Next, sans-serif" },
            },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Temperature (°F)",
              color: "#fff",
              font: { family: "Atkinson Hyperlegible Next, sans-serif" },
            },
            ticks: {
              color: "#fff",
              font: { family: "Atkinson Hyperlegible Next, sans-serif" },
            },
          },
          x: {
            title: {
              display: true,
              text: "Hour",
              color: "#fff",
              font: { family: "Atkinson Hyperlegible Next, sans-serif" },
            },
            ticks: {
              color: "#fff",
              font: { family: "Atkinson Hyperlegible Next, sans-serif" },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching hourly temperature data:", err);
  }
}

let mapInstance; // Initialize map instance

// Function to update the city map
function updateCityMap(latitude, longitude, city, state, country) {
  const mapContainer = document.getElementById("map");
  if (mapInstance) mapInstance.remove();

  mapInstance = L.map(mapContainer).setView([latitude, longitude], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance);

  const locationText = state
    ? `${city}, ${state}, ${country}`
    : `${city}, ${country}`;

  L.marker([latitude, longitude])
    .addTo(mapInstance)
    .bindPopup(
      `<span style="text-transform: capitalize;">${locationText}</span>`
    )
    .openPopup();
}
