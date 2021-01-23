import React, { useEffect, useState } from "react";
import "./App.css";
import Loading from "./components/Loading";
import Today from "./components/Today";
import Clouds from "./components/Clouds";
import Rain from "./components/Rain";
import Clear from "./components/Clear";
import Snow from "./components/Snow";
import Thunderstorm from "./components/Thunderstorm";
import Drizzle from "./components/Drizzle";

function App() {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState();
  const [userHasBeenLocated, setUserHasBeenLocated] = useState(false);
  const [fail, setFail] = useState();
  const [city, setCity] = useState();
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState();
  const [condition, setCondition] = useState();

  //---IP GEOLOCATE--//
  const getLocationByIp = async () => {
    setLoading(true);
    const url = "https://ipapi.co/json";

    const response = await fetch(url);
    const ipLocation = await response.json();
    setPosition({
      lat: parseFloat(ipLocation.latitude),
      lon: parseFloat(ipLocation.longitude),
    });

    setUserHasBeenLocated(true);
  };

  //---BROWSER GEOLOCATE---//
  const getLocationByBrowser = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      if (Boolean(position) === false) {
        setPosition({
          lat: parseFloat(latitude.toFixed(4)),
          lon: parseFloat(longitude.toFixed(4)),
        });
      }

      setUserHasBeenLocated(true);
    }

    function error(err) {
      //console.warn(`ERROR(${err.code}): ${err.message}`);
      getLocationByIp();
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  //---REVERSE GEOLOCATE---//
  const reverseGeolocation = async (lat, lon) => {
    const urlReverseGeolocate = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`;
    const responseCity = await fetch(urlReverseGeolocate);
    const userCity = await responseCity.json();
    setCity(userCity.city);
  };

  const getWeatherForecast = async () => {
    setLoading(true);

    getLocationByBrowser();

    if (userHasBeenLocated) {
      const { lat, lon } = position;

      const urlWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=b0c04244facf6d7f9f282d0a72cd8772`;
      const responseWeather = await fetch(urlWeather);
      const weatherData = await responseWeather.json();

      //necessary to get city name
      reverseGeolocation(lat, lon);

      setCondition(weatherData.current.weather[0].main.toLowerCase());
      setCurrentWeather(weatherData.current);
      setForecast(weatherData.daily);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherForecast();
  }, [userHasBeenLocated]);

  if (fail) return <h2>failed</h2>;

  if (loading) return <Loading />;

  if (!loading) {
    return (
      <div className={`container ${condition}`}>
        {condition === "clouds" ? <Clouds /> : ""}
        {condition === "rain" ? <Rain /> : ""}
        {condition === "clear" ? <Clear /> : ""}
        {condition === "snow" ? <Snow /> : ""}
        {condition === "thunderstorm" ? <Thunderstorm /> : ""}
        {condition === "drizzle" ? <Drizzle /> : ""}
        {userHasBeenLocated && (
          <Today city={city} weatherInfo={currentWeather} forecast={forecast} />
        )}
      </div>
    );
  }
}

export default App;
