import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct
import './LocationPage.css'; // Make sure to include the CSS file
import ImageGallery from 'react-image-gallery'; // Import the ImageGallery component
import 'react-image-gallery/styles/css/image-gallery.css';


const LocationPage = () => {
  let { id } = useParams(); // This hook gives us access to the URL parameters
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLocationData({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    fetchLocationData();
  }, [id]); // Re-run the effect if the URL parameter `id` changes

  if (!locationData) {
    return <div>Loading...</div>;
  }

  // Convert images to the format expected by react-image-gallery
  const images = locationData.pictures.map((image) => ({
    original: image,
    thumbnail: image // You can use the same URL if you don't have separate thumbnails
  }));

  return (
    <div className="location-page">
      <div className="location-header">
        <h2 className="location-title">{locationData.title}</h2>
      </div>
      <ImageGallery items={images} />
      <div className="location-content">
        <div className="location-tags">
          {locationData.tags.map((tag, index) => (
            <span key={index} className="tag-label">{tag}</span>
          ))}
        </div>
        <p className="location-description">{locationData.description}</p>
      </div>
    </div>
  );
};

export default LocationPage;
