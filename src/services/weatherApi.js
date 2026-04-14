export function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export async function fetchWeather(location) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
  );
  const geoData = await geoRes.json();

  if (!geoData.results) throw new Error("Location not found");

  const { latitude, longitude, timezone, name, country_code } =
    geoData.results.at(0);

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`,
  );

  const weatherData = await weatherRes.json();
  
  return {
    name,
    country_code,
    weatherData: weatherData.daily,
  };
}
