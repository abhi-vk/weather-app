import React from 'react';

const WeatherOverview = ({ city, weather }) => {
  // Check if weather object is defined and contains temperature property
  if (!weather || !weather.temperature || !weather.humidity || !weather.icon || !weather.description) {
    return (
      <div className="weather-card">
        <div className="weather-details">
          <h2>{city}</h2>
          <div className="weather-info">
            <div className="temperature">
              <strong>Temperature:</strong> N/A
            </div>
            <div className="humidity">
              <strong>Humidity:</strong> N/A
            </div>
            <div className="description">
              <strong>Description:</strong> N/A
            </div>
          </div>
        </div>
        <div className="weather-icon">
          <img src="https://via.placeholder.com/64" alt="Placeholder" />
        </div>
      </div>
    );
  }

  // Destructure weather object
  const { temperature, humidity, icon, description } = weather;

  return (
    <div className="weather-card">
      <div className="weather-details">
        <h2>{city}</h2>
        <div className="weather-info">
          <div className="temperature">
            <strong>Temperature:</strong> {temperature}°C
          </div>
          <div className="humidity">
            <strong>Humidity:</strong> {humidity}%
          </div>
          <div className="description">
            <strong>Description:</strong> {description}
          </div>
        </div>
      </div>
      <div className="weather-icon">
        <img src={`https://cdn.weatherapi.com/weather/64x64/day/${icon}.png`} alt={description} />
      </div>
    </div>
  );
};

export default WeatherOverview;
