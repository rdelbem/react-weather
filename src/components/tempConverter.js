const convertTempFromKelvin = (type, temp) => {
  if (type === "celsius") {
    const celsius = temp - 273.15;
    return `${celsius.toFixed(1)}°`;
  }
  if (type === "fahrenheit") {
    const fahrenheit = (temp * 9) / 5 - 459.67;
    return `${fahrenheit.toFixed(1)}°`;
  }
};

export default convertTempFromKelvin;
