import WeatherItem from "./WeatherItem";

const WeatherList = ({ city, dates, codes, min, max }) => {
  return (
    <div>
      <h2>{city}</h2>
      <ul className="weather">
        {dates.map((date, i) => (
          <WeatherItem
            key={date}
            date={date}
            code={codes[i]}
            min={min[i]}
            max={max[i]}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
};

export default WeatherList;
