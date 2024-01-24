import React, { useState, useEffect } from 'react';
import WeatherWidgetStyles from './WeatherWidget.module.css';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [country, setCountry] = useState('');
  const [submittedCountry, setSubmittedCountry] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (submittedCountry.trim() === '') {
        // No realiza la petición si no se ha ingresado un país
        return;
      }

      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=2c8e8ed65d8d4d7f99b110534242301&q=${submittedCountry}&aqi=no`
      );

      try {
        const data = await response.json();
        setWeatherData(data);
        setShowErrorMessage(false); // Si se obtienen datos, oculta el mensaje de error
      } catch (error) {
        console.error('Error al obtener datos del clima', error);
        setWeatherData(null);
        setShowErrorMessage(true); // Muestra el mensaje de error
      }
    };

    fetchData();
  }, [submittedCountry]);

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (country.trim() === '') {
      // Muestra el mensaje de error si no se ha ingresado un país
      setShowErrorMessage(true);
      return;
    }

    setSubmittedCountry(country);
    setIsButtonPressed(true);
  };

  return (
    <div className={WeatherWidgetStyles['widget-container']}>
      <form className={WeatherWidgetStyles['form']} onSubmit={handleSubmit}>
        <label className={WeatherWidgetStyles['label']} htmlFor="countryInput">
          
        </label>
        <input
          type="text"
          id="countryInput"
          value={country}
          onChange={handleCountryChange}
          className={WeatherWidgetStyles['input']}
        />
        <button type="submit" className={WeatherWidgetStyles['button']}>
          Obtener Clima
        </button>
        {showErrorMessage && (
          <p className={WeatherWidgetStyles['error-message']}>
            Por favor, ingresa un país válido.
          </p>
        )}
      </form>
    <div className={WeatherWidgetStyles['decore']}></div>
      <div className={`${WeatherWidgetStyles['weather-info']} ${isButtonPressed ? '' : WeatherWidgetStyles['no-country']}`}>
        {weatherData && (
          <>
            {weatherData.current.condition.icon && (
              <img
                src={`http:${weatherData.current.condition.icon}`}
                alt="Weather Icon"
                className={WeatherWidgetStyles['weather-icon']}
              />
            )} <p className={WeatherWidgetStyles['temperature']}>
            {weatherData.current.temp_c}°C
          </p>
            <p className={WeatherWidgetStyles['location']}>
              Ciudad: {weatherData.location.name}, {weatherData.location.country}
            </p>
           
            <p className={WeatherWidgetStyles['description']}>
              Descripción: {weatherData.current.condition.text}
            </p>
          </>
        )}
      </div>
     
    </div>
  );
};

export default WeatherWidget;
