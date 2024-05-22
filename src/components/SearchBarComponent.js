import React from 'react';
import { Container, Form, FormControl, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './SearchBarComponent.css'; // Import the updated CSS file


// Stateless functional component for search bar
const SearchBarComponent = ({ onSearch }) => {
  // Handler for search input, this would be passed from the parent component if needed
  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = event.target.elements.search.value.trim();
    onSearch(searchTerm);
  };

  return (
<Container className="search-bar-container">
  <Form className="d-flex" onSubmit={handleSearch}>
    <FormControl
      type="search"
      placeholder=""
      className="search-input"
      aria-label="Search"
      name="search"
    />
  <Button type="submit" className="search-button">
    Search
  </Button>

  </Form>
</Container>




  );
};

// Prop-Types can be used to enforce the type of props the component expects
SearchBarComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBarComponent;
