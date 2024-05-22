// src/components/LocationDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const LocationDetail = () => {
  let { id } = useParams();
  // Fetch and display location details using the id from the URL parameter
  // ...

  return (
    <div>
      {/* Render the location details here */}
      <h1>Location Detail for ID: {id}</h1>
    </div>
  );
};

export default LocationDetail;