import { useState, useEffect } from "react";
import Search from "./components/Search";
import Loader from "./components/Loader";
import WeatherList from "./components/WeatherList";
import { fetchWeather, convertToFlag } from "./services/weatherApi";

const App = () => {
  const [location, setLocation] = useState(
    localStorage.getItem("location") || "",
  );
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
        const data = await fetchWeather(location);
        setCity(`Weather For ${data.name} ${convertToFlag(data.country_code)}`);
        setWeatherData(data.weatherData);
      } catch (err) {
        console.error(err); // ✅ تصليح الغلط
      } finally {
        // setShouldFetch(false); // مهم جدًا
        setIsLoading(false);
      }
    }

    if (location) getWeather(location);
  }, [location]);
  // local storage
  useEffect(() => {
    localStorage.setItem("location", location);
  }, [location]);
  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <Search location={location} setLocation={setLocation} />

      {/* <button onClick={() => setShouldFetch(true)}>Get weather</button> */}
      {isLoading && <Loader />}
      {dates && (
        <WeatherList
          city={city}
          dates={dates}
          codes={codes}
          min={min}
          max={max}
        />
      )}
    </div>
  );
};

export default App;
