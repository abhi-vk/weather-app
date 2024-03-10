import React, { useState, useEffect } from 'react';
import WeatherOverview from './WeatherOverview';
import axios from 'axios';

const CitySelection = ({ onSelectCity, selectedCities, onRemoveCity }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setError('');
  };

  const handleAddCity = async () => {
    if (selectedCities.length < 4) {
      if (city.trim() !== '') {
        if (selectedCities.includes(city)) {
          setError('City already added');
        } else {
          try {
            const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
            const newWeatherData = response.data;
            if ('error' in newWeatherData) {
              setError('Enter a valid city');
            } else {
              setWeatherData([...weatherData, newWeatherData]);
              onSelectCity(city);
              setCity('');
            }
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        }
      }
    } else {
      setError('You can add a maximum of 4 cities.');
    }
  };

  const handleRemoveCity = (city) => {
    const updatedWeatherData = weatherData.filter(item => item.city !== city);
    setWeatherData(updatedWeatherData);
    onRemoveCity(city);
  };

  useEffect(() => {
    const fetchData = async () => {
      const promises = selectedCities.map(async (city) => {
        try {
          const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching weather data:', error);
          return null;
        }
      });

      const weatherDataArray = await Promise.all(promises);
      setWeatherData(weatherDataArray.filter(item => item !== null));
    };

    fetchData();
  }, [selectedCities]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control mb-2 mr-sm-2 shadow-sm rounded-pill"
              placeholder="Enter city name"
              value={city}
              onChange={handleCityChange}
              style={{ borderColor: '#ced4da', backgroundColor: '#f8f9fa', color: '#495057', fontSize: '16px', padding: '10px' }}
            />
            <div className="input-group-append">
              <button className="btn btn-primary bg-gradient" onClick={handleAddCity}>
                Add City
              </button>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
      <div className="row justify-content-center">
        {weatherData.map((data, index) => (
          <div key={index} className="col-lg-6 col-md-6 mb-3">
            <WeatherOverview city={data.city} weather={data} />
            <button className="btn btn-danger bg-gradient" onClick={() => handleRemoveCity(data.city)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySelection;
