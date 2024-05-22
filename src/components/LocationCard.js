import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './LocationCard.css'; // Import the CSS file

const LocationCard = ({ location }) => {
  return (
    <Col md={4} className="mb-2">
      <Link to={`/locations/${location.id}`} className="card-link">
        <Card> 
          <Card.Img variant="top" src={location.image} alt={`Image of ${location.title}`} />
          <Card.Body>
            <Card.Title className="card-title">{location.title}</Card.Title>
            {/* Additional content */}
          </Card.Body>
          <Card.Footer className="card-footer">
            {location.city}
          </Card.Footer>
        </Card>
      </Link>
    </Col>
  );
};

LocationCard.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired
};

export default LocationCard;