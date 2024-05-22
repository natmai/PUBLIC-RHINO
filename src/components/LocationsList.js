import React from 'react';
import { Container, Row } from 'react-bootstrap';
import LocationCard from './LocationCard';
import PropTypes from 'prop-types';

// Functional component for rendering a list of locations
const LocationsList = ({ locations }) => {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Row>
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </Row>
    </Container>
  );
};

// Prop types validation
LocationsList.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  })).isRequired
};

export default LocationsList;