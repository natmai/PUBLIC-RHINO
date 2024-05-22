import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, Form, Button } from 'react-bootstrap';
import './DropdownCheckboxFilter.css';
import './tagFilter.css';


const DropdownCheckboxFilter = ({ title, options, selectedOptions, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle the dropdown open state
  const toggleOpen = () => setIsOpen(!isOpen);

  // Handles the logic to close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handles checkbox state change
  const handleCheckboxChange = (option) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions, option];
    onFilterChange(newSelectedOptions);
  };

  return (
    <div ref={dropdownRef}>
      <Button class='filterTitle' onClick={toggleOpen}>{title}</Button>
      <Dropdown.Menu show={isOpen} align="right">
        {options.map((option) => (
          <Dropdown.Item key={option} as="button">
            <Form.Check 
              type="checkbox"
              label={option}
              id={`dropdown-check-${option}`}
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              className='formCheck'
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </div>
  );
};

export default DropdownCheckboxFilter;
