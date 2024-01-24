import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSearch, faWater, faWind } from '@fortawesome/free-solid-svg-icons';
import WeatherWidgetStyles from './WeatherWidget.module.css';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [country, setCountry] = useState('');
  const [submittedCountry, setSubmittedCountry] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY || process.env.REACT_APP_API_KEY;

  
  useEffect(() => {
    const fetchData = async () => {
      if (submittedCountry.trim() === '') {
        // No realiza la petición si no se ha ingresado un país
        return;
      }

      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${submittedCountry}&aqi=no`
        );

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
          <FontAwesomeIcon icon={faLocationDot} className={WeatherWidgetStyles['search-button']} />
        </label>
        <input
          type="text"
          id="countryInput"
          placeholder='Enter Your Location'
          value={country}
          onChange={handleCountryChange}
          className={WeatherWidgetStyles['input']}
        />
        <button type="submit" className={WeatherWidgetStyles['button']}>
          <FontAwesomeIcon icon={faSearch} />
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
              <div className={WeatherWidgetStyles['weather-icon-container']}>
                <img
                  src={`http:${weatherData.current.condition.icon}`}
                  alt="Weather Icon"
                  className={WeatherWidgetStyles['weather-icon']}
                />
              </div>
            )}
            <p className={WeatherWidgetStyles['temperature']}>
              {weatherData.current.temp_c}
              <span className={WeatherWidgetStyles['celcius']}>°C</span>
            </p>
            <p className={WeatherWidgetStyles['condition']}>
              {weatherData.current.condition.text}
            </p>
            <div className={WeatherWidgetStyles['container-loc-desc']}>
              <p className={WeatherWidgetStyles['location']}>
                <FontAwesomeIcon icon={faWater} /> {weatherData.current.humidity}%, <span className={WeatherWidgetStyles['detail']}>Humidity</span>
              </p>
              <p className={WeatherWidgetStyles['description']}>
                <FontAwesomeIcon icon={faWind} />: {weatherData.current.wind_kph}Km/h<span className={WeatherWidgetStyles['detail']}>Wind speed</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
