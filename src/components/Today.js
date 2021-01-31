import React, { useEffect, useRef } from "react";
import dateformat from "dateformat";
//import prettyMilliseconds from "pretty-ms"; useful, it speeded up development process
import Forecast from "./Forecast";
import convertTempFromKelvin from "./tempConverter";

function Today(props) {
  const city = props.city;
  const { dt, sunrise, sunset, temp, weather } = props.weatherInfo;
  const { icon, id, main } = weather[0];
  const daily = props.forecast;
  const path = useRef(null);
  const sunMoon = useRef(null);
  const sunsetMs = sunset * 1000;
  const sunriseMs = sunrise * 1000;
  const currentHour = Date.now();

  const hasTheSunset = () => {
    if (
      currentHour > sunsetMs &&
      parseFloat(dateformat(currentHour, "HH:MM").split(":").join(".")) < 23.59
    ) {
      return true;
    }

    if (currentHour < sunriseMs) {
      return true;
    }

    return false;
  };

  const howLongUntilDayOrNight = () => {
    const hoursOfLight = sunsetMs - sunriseMs;
    const hoursOfDarkness = 86400000 - hoursOfLight; //one day in ms minus hours of light

    //night
    if (currentHour > sunsetMs || currentHour < sunriseMs) {
      const oneDayInMs = 86400000;
      // sunrise + 86400 -> It is necessary to add one more day (864000 s) in order to get the next day sunrise hour before midnight

      const isItPastMidnight = () => {
        const hourToInt = parseFloat(
          dateformat(currentHour, "HH:MM").split(":").join(".")
        );
        const sunriseToInt = parseFloat(
          dateformat(sunriseMs, "HH:MM").split(":").join(".")
        );

        return hourToInt > 0 && hourToInt < sunriseToInt ? true : false;
      };

      const percentageOfNightPassed = (isItPastMidnight) => {
        const remainingHoursOfNight = isItPastMidnight
          ? sunriseMs - currentHour
          : sunriseMs + oneDayInMs - currentHour;

        const percentageOfNightLeft = Math.floor(
          (remainingHoursOfNight * 100) / hoursOfDarkness
        );
        //console.log(percentageOfNightLeft);

        return 100 - percentageOfNightLeft;
      };

      return percentageOfNightPassed(isItPastMidnight());
    }

    //day
    if (currentHour > sunriseMs && currentHour < sunsetMs) {
      const remainingHoursOfDayLight = sunsetMs - currentHour;
      const percentageOfDayLeft = Math.floor(
        (remainingHoursOfDayLight * 100) / hoursOfLight
      );

      // console.log(percentageOfDayLeft + "%");
      // console.log(prettyMilliseconds(remainingHoursOfDayLight));

      return 100 - percentageOfDayLeft;
    }
  };

  const moveSunMoon = (prcnt) => {
    const pathLength = Math.floor(path.current.getTotalLength());
    prcnt = (prcnt * pathLength) / 100;

    // Get x and y values at a certain point in the line
    let pt = path.current.getPointAtLength(prcnt);
    pt.x = Math.round(pt.x);
    pt.y = Math.round(pt.y);

    sunMoon.current.style.webkitTransform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
  };

  useEffect(() => {
    moveSunMoon(howLongUntilDayOrNight());
    //console.log(howLongUntilDayOrNight());
  }, []);

  return (
    <div className="main">
      <div className="today">
        <h1>{city}</h1> <small>{dateformat(dt * 1000, "dd/mm, HH:MM")}</small>
        <div className="top">
          <div className="temp">
            <p>{convertTempFromKelvin("celsius", temp)}</p>
          </div>
          <div className="icon">
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
          </div>
        </div>
        <div className="sun-moon-container">
          <div ref={sunMoon} className="sun"></div>
          <svg width="250" height="80">
            <g className="path" fill="none" stroke="black" strokeWidth="2">
              <path
                ref={path}
                d="M 0 80 Q 125 -20 250 80"
                strokeDasharray="5,5"
                fill="transparent"
              />
            </g>
          </svg>
        </div>
        <div className="sunset-sunrise-container">
          {hasTheSunset() && (
            <>
              <div className="first-hour">
                <center>
                  {" "}
                  <img
                    className="icon"
                    src="https://img.icons8.com/ios-filled/50/000000/sunset.png"
                  />
                  <small>{dateformat(sunsetMs, "HH:MM")}</small>
                </center>
              </div>
              <div className="second-hour">
                <center>
                  {" "}
                  <img
                    className="icon"
                    src="https://img.icons8.com/ios-filled/50/000000/sunrise.png"
                  />
                  <small>{dateformat(sunriseMs, "HH:MM")}</small>
                </center>
              </div>
            </>
          )}
          {!hasTheSunset() && (
            <>
              <div className="first-hour">
                <center>
                  {" "}
                  <img
                    className="icon"
                    src="https://img.icons8.com/ios-filled/50/000000/sunrise.png"
                  />
                  <small>{dateformat(sunriseMs, "HH:MM")}</small>
                </center>
              </div>
              <div className="second-hour">
                <center>
                  {" "}
                  <img
                    className="icon"
                    src="https://img.icons8.com/ios-filled/50/000000/sunset.png"
                  />
                  <small>{dateformat(sunsetMs, "HH:MM")}</small>
                </center>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="forecast">
        {daily.map((item, index) => {
          // console.log(item);
          if (index < 3) return <Forecast key={index} {...item} />;
        })}
      </div>
    </div>
  );
}

export default Today;
