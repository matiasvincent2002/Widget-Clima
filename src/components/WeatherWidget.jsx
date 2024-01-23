import React, { useState, useEffect } from 'react';
import WeatherWidgetStyles from './WeatherWidget.module.scss';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [country, setCountry] = useState('Argentina');
  const [submittedCountry, setSubmittedCountry] = useState('Argentina');


 
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=2c8e8ed65d8d4d7f99b110534242301&q=${submittedCountry}&aqi=no`
      );

      try {
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error al obtener datos del clima', error);
      }
    };

    fetchData();
  }, [submittedCountry]);

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedCountry(country);
  };

  return (
    <div className={WeatherWidgetStyles['widget-container']}>
      <h2>Widget de Clima</h2>

      {weatherData && (
        <div className={WeatherWidgetStyles['weather-info']}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="countryInput">Ingresa un país:</label>
            <input
              type="text"
              id="countryInput"
              value={country}
              onChange={handleCountryChange}
            />
            <button type="submit">Obtener Clima</button>
          </form>

          {weatherData.current.condition.icon && (
            <img
              src={`http:${weatherData.current.condition.icon}`}
              alt="Weather Icon"
              className={WeatherWidgetStyles['weather-icon']}
            />
          )}
          <p>
            Ciudad: {weatherData.location.name}, {weatherData.location.country}
          </p>
          <p>Temperatura Actual: {weatherData.current.temp_c}°C</p>
          <p>Descripción: {weatherData.current.condition.text}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
