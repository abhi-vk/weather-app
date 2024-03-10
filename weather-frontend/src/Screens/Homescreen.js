import CitySelection from '../components/CitySelection'
import React, { useState } from 'react';
import '../App.css';
import PersonalizedAlerts from '../components/PersonalizedAlerts';
import TransparentNavbar from '../components/Navbar';

export default function Homescreen() {
    const [selectedCities, setSelectedCities] = useState([]);
  const handleSelectCity = (city) => {
    if (selectedCities.length < 4) {
      if (!selectedCities.includes(city)) {
        setSelectedCities([...selectedCities, city]);
      } else {
        alert('City is already selected.');
      }
    } else {
      alert('You can add a maximum of 4 cities.');
    }
  };
  const handleRemoveCity = (city) => {
    setSelectedCities(selectedCities.filter((selectedCity) => selectedCity !== city));
  };
  return (
    <>
    <div>
    <TransparentNavbar/>
    
      <h1 className="text-center"><b>Weather App</b></h1>
     
      <CitySelection
        onSelectCity={handleSelectCity}
        selectedCities={selectedCities}
        onRemoveCity={handleRemoveCity}
      />
      <PersonalizedAlerts/>
      </div>
    </>
  )
}

