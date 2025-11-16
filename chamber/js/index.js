// Dublin, Ireland coordinates
const LAT = 53.3498;
const LON = -6.2603;
const OWM_API_KEY = "ee926043c582ae4d830ad1ff7e558e90";
const UNITS = "metric";

async function loadWeather() {
    try {
        const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OWM_API_KEY}&units=${UNITS}`;
        const currentRes = await fetch(currentURL);
        if (!currentRes.ok) throw new Error("Current weather fetch failed");
        const current = await currentRes.json();

        const temp = Math.round(current.main.temp);
        const desc = current.weather[0].description;
        const icon = current.weather[0].icon;
        const cityName = current.name;

        document.getElementById("wx-temp").textContent = `${temp}°C`;
        document.getElementById("wx-desc").textContent = desc;
        document.getElementById("wx-city").textContent = cityName;
        const iconImg = document.getElementById("wx-icon");
        iconImg.src = `https://api.openweathermap.org/img/wn/${icon}@2x.png`;
        iconImg.alt = desc;


        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${OWM_API_KEY}&units=${UNITS}`;
        const fRes = await fetch(forecastURL);
        if (!fRes.ok) throw new Error("Forecast fetch failed");
        const forecast = await fRes.json();


        const noonItems = forecast.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .slice(0, 3);

        const container = document.getElementById("forecast");
        container.innerHTML = "";

        noonItems.forEach(item => {
            const d = new Date(item.dt * 1000);
            const label = d.toLocaleDateString(undefined, { weekday: "long" });
            const dayTemp = Math.round(item.main.temp);
            const dayIcon = item.weather[0].icon;
            const dayDesc = item.weather[0].description;

            const card = document.createElement("div");
            card.className = "forecast-card";
            card.innerHTML = `
        <p><strong>${label}</strong></p>
        <img src="https://api.openweathermap.org/img/wn/${dayIcon}.png" alt="${dayDesc}">
        <p>${dayTemp}°C</p>
      `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        document.getElementById("forecast").textContent = "Weather unavailable.";
    }
}

document.addEventListener("DOMContentLoaded", loadWeather);

async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Unable to load member data.");

        const members = await response.json();


        const premiumMembers = members.filter(m => m.membership >= 2);


        const shuffled = premiumMembers.sort(() => 0.5 - Math.random());


        const spotlightCount = Math.random() > 0.5 ? 3 : 2;
        const selected = shuffled.slice(0, spotlightCount);

        const container = document.getElementById("spotlights");
        container.innerHTML = "";

        selected.forEach(member => {
            const card = document.createElement("article");
            card.classList.add("spotlight");

            card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo">

        <div>
          <h4>
            ${member.name}
            <span class="badge ${member.membership === 3 ? "gold" : "silver"}">
              ${member.membership === 3 ? "Gold" : "Silver"}
            </span>
          </h4>

          <p class="meta">${member.address}</p>
          <p class="meta">${member.phone}</p>

          <a href="${member.website}" target="_blank">
            ${member.website}
          </a>
        </div>
      `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Spotlight error:", error);
    }
}


document.addEventListener("DOMContentLoaded", loadSpotlights);
