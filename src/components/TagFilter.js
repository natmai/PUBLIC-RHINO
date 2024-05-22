// TagFilter.js
import React from 'react';
import { Form } from 'react-bootstrap';
import './tagFilter.css';

const TagFilter = ({ availableTags, selectedTags, onTagChange }) => {
  const handleTagSelectionChange = (tag, isChecked) => {
    const newSelectedTags = isChecked 
      ? [...selectedTags, tag] 
      : selectedTags.filter(selectedTag => selectedTag !== tag);
    onTagChange(newSelectedTags);
  };

  return (
    <div>
        <h5 className='filterTitle'>Select Tag(s):</h5>
      {availableTags.map((tag) => (
        <Form.Check
          key={tag}
          type="checkbox"
          label={tag}
          checked={selectedTags.includes(tag)}
          onChange={(e) => handleTagSelectionChange(tag, e.target.checked)}
          className='formCheck'
        />
      ))}
    </div>
  );
};

export default TagFilter;
