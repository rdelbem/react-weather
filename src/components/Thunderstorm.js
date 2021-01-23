import React from "react";

function Thunderstorm() {
  return (
    <div className="behind-image">
      <div>
        <svg
          className="viewbox"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="outsideblur">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="2"
                result="blur"
              />
              <feComponentTransfer>
                <feFuncA in="blur" type="linear" slope="5" result="noalfa" />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="blur" />
            </filter>
          </defs>
          <polyline
            className="lightning"
            points="0,0 10,10 11,9 15,20 14,21 16,22 18,21 20,25 19,30 22,37 19,37 26,40 46, 50 48, 48 55, 60 58, 60 66, 70 58, 72 75, 85 95, 95 100, 102 103, 110 111"
          ></polyline>
        </svg>
      </div>
    </div>
  );
}

export default Thunderstorm;
