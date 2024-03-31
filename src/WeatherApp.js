import React, { useState } from "react";
import "./WeatherApp.css";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    if (!city) {
      alert("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiKey = "7c8ab9eaa239454b9bc93124243103";
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      const { temp_c, humidity, condition, wind_kph } = data.current;
      setWeatherData({
        temperature: temp_c,
        humidity,
        condition: condition.text,
        windSpeed: wind_kph,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data");
      setWeatherData(null);
      alert("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <p>Loading data...</p>}
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <WeatherBox
            title="Temperature"
            value={`${weatherData.temperature}°C`}
          />
          <WeatherBox title="Humidity" value={`${weatherData.humidity}%`} />
          <WeatherBox title="Condition" value={weatherData.condition} />
          <WeatherBox
            title="Wind Speed"
            value={`${weatherData.windSpeed} km/h`}
          />
        </div>
      )}
    </div>
  );
}

function WeatherBox({ title, value }) {
  return (
    <div className="weather-box">
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
}

export default WeatherApp;
