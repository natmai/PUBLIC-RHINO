import React, { useState, useEffect } from 'react';
import SearchBarComponent from '../components/SearchBarComponent';
import LocationsList from '../components/LocationsList';
import StateFilter from '../components/StateFilter';
import CityFilter from '../components/CityFilter';
import TagFilter from '../components/TagFilter';
import DropdownCheckboxFilter from '../components/DropdownCheckboxFilter'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct
import './filter.css';

const HomePage = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [displayedLocations, setDisplayedLocations] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAndUpdateListings = async () => {
      const querySnapshot = await getDocs(collection(db, 'listings'));
      const updates = []; // Keep track of update promises
      const states = new Set();
      const cities = new Set();
      const tagsSet = new Set();

      const listings = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        const id = docSnapshot.id;

        // Split cityState into city and state
        const parts = data.cityState.split(',').map(part => part.trim());
        const [city, state] = parts.length === 2 ? parts : [null, null];
        if (state) states.add(state);
        if (city) cities.add(city);

        (data.tags || []).forEach(tag => tagsSet.add(tag));

        if (!data.featureList) {
          const featureList = [
            data.cityState,
            data.title,
            ...(data.tags || []),
          ];
          updates.push(updateDoc(doc(db, 'listings', id), { featureList }));
          data.featureList = featureList;
        }

        return {
          id,
          ...data,
          image: data.pictures[0] || "https://via.placeholder.com/150",
          city: city,
          state: state,
        };
      });

      await Promise.all(updates);

      setAllLocations(listings);
      setDisplayedLocations(listings);
      setAvailableStates([...states]);
      setAvailableCities([...cities]);
      setAvailableTags([...tagsSet]);
    };

    fetchAndUpdateListings();
  }, []);

  useEffect(() => {
    let locationsFilteredByState = allLocations;
  
    // Filter by search term if one exists
    if (searchTerm) {
      locationsFilteredByState = locationsFilteredByState.filter(location =>
        location.featureList && location.featureList.some(feature =>
          feature.toLowerCase().includes(searchTerm)
        )
      );
    }
  
    // Filter by selected states to determine available cities
    if (selectedStates.length > 0) {
      locationsFilteredByState = locationsFilteredByState.filter(({ state }) =>
        selectedStates.includes(state)
      );
    }
  
    // Calculate available cities from locationsFilteredByState
    let citiesBasedOnState = new Set();
    locationsFilteredByState.forEach(({ cityState }) => {
      if (cityState) {
        const [city, state] = cityState.split(',').map(part => part.trim());
        if (selectedStates.length === 0 || selectedStates.includes(state)) {
          citiesBasedOnState.add(city);
        }
      }
    });
  
    // Filter by selected cities if any are selected to determine displayed locations
    let locationsFilteredByCity = locationsFilteredByState;
    if (selectedCities.length > 0) {
      locationsFilteredByCity = locationsFilteredByState.filter(({ city }) =>
        selectedCities.includes(city)
      );
    }
  
    // Calculate available tags based on the state and city filtered locations
    let tagsBasedOnStateCity = new Set();
    locationsFilteredByCity.forEach(({ tags }) => {
      (tags || []).forEach(tag => tagsBasedOnStateCity.add(tag));
    });
  
    // Apply the tag filter to filteredLocations if tags are selected
    let filteredLocations = locationsFilteredByCity;
    if (selectedTags.length > 0) {
      filteredLocations = filteredLocations.filter(({ tags }) =>
        tags.some(tag => selectedTags.includes(tag))
      );
    }
  
    // Update states for cities and tags available for filtering, and for displaying locations
    setAvailableCities([...citiesBasedOnState]);
    setAvailableTags([...tagsBasedOnStateCity]);
    setDisplayedLocations(filteredLocations);
  }, [searchTerm, selectedStates, selectedCities, selectedTags, allLocations]);
  
  

  const handleStateChange = (selectedStates) => {
    setSelectedStates(selectedStates);
    setSelectedCities([]);
    setSelectedTags([]);
  };

  const handleCityChange = (selectedCities) => {
    setSelectedCities(selectedCities);
    setSelectedTags([]);
  };

  const handleTagChange = (selectedTags) => {
    setSelectedTags(selectedTags);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm.trim().toLowerCase());
    if (!searchTerm.trim()) {
      setDisplayedLocations(allLocations);
    } else {
      const searchFilteredLocations = allLocations.filter(location =>
        location.featureList && location.featureList.some(feature =>
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setDisplayedLocations(searchFilteredLocations);
    }
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedTags([]);
  };

  const clearFilters = () => {
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedTags([]);
    // Optionally reset the search term if you have a search bar
    setSearchTerm('');
  };
  
  return (
    <>
      <SearchBarComponent onSearch={handleSearch} />

      <div className="container">
        <LocationsList locations={displayedLocations} />
        <div className="filters">
        <button className="filterTitle" onClick={clearFilters}>Clear Filters</button>
        <h1></h1>
          <DropdownCheckboxFilter class='filterTitle'
            title="Select State(s)"
            options={availableStates}
            selectedOptions={selectedStates}
            onFilterChange={handleStateChange}
          />
          <h1></h1>
          <DropdownCheckboxFilter class='filterTitle'
            title="Select City(s)"
            options={availableCities}
            selectedOptions={selectedCities}
            onFilterChange={handleCityChange}
          />
          <h1></h1>
          <DropdownCheckboxFilter class='filterTitle'
            title="Select Tag(s)"
            options={availableTags}
            selectedOptions={selectedTags}
            onFilterChange={handleTagChange}
          />
        </div>
      </div>
    </>
  );
  
};

export default HomePage;
