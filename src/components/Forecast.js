import React from "react";
import convertTempFromKelvin from "./tempConverter";
import dateformat from "dateformat";

function Forecast({ dt, temp, weather }) {
  const { max, min } = temp;
  const { icon } = weather[0];

  return (
    <div className="forecast-card">
      <center>
        <p>{dateformat(dt * 1000, "dd/mm")}</p>
        <p> ▲ {convertTempFromKelvin("celsius", max)}</p>
        <img
          className="icon"
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt=""
        />
        <p> ▼ {convertTempFromKelvin("celsius", min)}</p>
      </center>
    </div>
  );
}

export default Forecast;
