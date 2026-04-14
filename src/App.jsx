import { useState, useEffect } from "react";
function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

const App = () => {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [shouldFetch, setShouldFetch] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [city, setCity] = useState("");
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weatherData;
  useEffect(() => {
    // if (!shouldFetch) return;

    async function getWeather(location) {
      try {
        setIsLoading(true);
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
        );
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error("Location not found");

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);

        setCity(`Weather For ${name} ${convertToFlag(country_code)}`);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`,
        );

        const weatherData = await weatherRes.json();
        setWeatherData(weatherData.daily);
      } catch (err) {
        console.error(err); // ✅ تصليح الغلط
      } finally {
        // setShouldFetch(false); // مهم جدًا
        setIsLoading(false);
      }
    }

    if (location) getWeather(location);
  }, [location]);
  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <input
        type="text"
        placeholder="Search any city..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* <button onClick={() => setShouldFetch(true)}>Get weather</button> */}
      {isLoading && <p className="loader">Loading...</p>}
      {dates && (
        <div>
          <h2>{city}</h2>
          <ul className="weather">
            {dates.map((date, i) => (
              <li key={date} className="day">
                <span>{getWeatherIcon(codes[i])}</span>
                <p>{i === 0 ? "Today" : formatDay(date)}</p>
                <p>
                  {Math.round(min[i])}°C / {Math.round(max[i])}°C
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
