// CityFilter.js
import React from 'react';
import { Form } from 'react-bootstrap';

const CityFilter = ({ availableCities, selectedCities, onCityChange, isDisabled }) => {
  const handleCitySelectionChange = (city, isChecked) => {
    const newSelectedCities = isChecked 
      ? [...selectedCities, city] 
      : selectedCities.filter(selectedCity => selectedCity !== city);
    onCityChange(newSelectedCities);
  };

  return (
    <div>
        <h5 className="filterTitle">Select City(s):</h5>
      {availableCities.map((city) => (
        <Form.Check
          key={city}
          type="checkbox"
          label={city}
          checked={selectedCities.includes(city)}
          onChange={(e) => handleCitySelectionChange(city, e.target.checked)}
          disabled={isDisabled}
          className='formCheck'
        />
      ))}
    </div>
  );
};

export default CityFilter;
