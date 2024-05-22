import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button, Form, Container, Row, Col, InputGroup } from 'react-bootstrap';
import './EditListingPage.css';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState({
    title: '',
    cityState: '',
    tags: [],
    description: '',
    pictures: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [deleteImageIndices, setDeleteImageIndices] = useState(new Set());

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing({
          ...docSnap.data(),
          tags: docSnap.data().tags.join(', '), // Convert array of tags to string
        });
      } else {
        alert('Listing does not exist');
        navigate('/manage');
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleChange = ({ target: { name, value } }) => {
    setListing(prevListing => ({
      ...prevListing,
      [name]: value
    }));
  };

  const handleNewImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleDeleteImage = async (imageIndex) => {
    const imageUrl = listing.pictures[imageIndex];
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    
    if (confirmDelete) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        const updatedPictures = listing.pictures.filter((_, idx) => idx !== imageIndex);
        setListing({ ...listing, pictures: updatedPictures });
      } catch (error) {
        console.error('Error deleting image: ', error);
      }
    }
  };

  const handleUploadImages = async () => {
    const uploadPromises = Array.from(newImages).map(file => {
      const imageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
      return uploadBytes(imageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const confirmUpdate = window.confirm("Update listing? Please confirm your changes.");
    if (confirmUpdate) {
      try {
        // Generate the new featureList
        const updatedFeatureList = [
          listing.cityState,
          listing.title,
          ...(listing.tags.split(',').map(tag => tag.trim())), // Ensure tags are updated and included
        ];
  
        const newImageUrls = await handleUploadImages();
        const updatedPictures = [
          ...listing.pictures.filter((_, index) => !deleteImageIndices.has(index)),
          ...newImageUrls,
        ];
  
        // Update the document with the new listing details including the updated featureList
        await updateDoc(doc(db, 'listings', id), {
          ...listing,
          tags: listing.tags.split(',').map(tag => tag.trim()),
          pictures: updatedPictures,
          featureList: updatedFeatureList, // Include the updated featureList in the Firestore document
        });
  
        alert('Listing updated successfully');
        navigate('/manage');
      } catch (error) {
        console.error('Error updating listing:', error);
      }
    }
  };
  

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete listing? This will also delete all associated images.");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'listings', id));
        alert('Listing deleted successfully');
        navigate('/manage');
      } catch (error) {
        console.error('Error deleting listing: ', error);
      }
    }
  };

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col className="text-center">
          <h2>Edit Listing</h2>
        </Col>
      </Row>      
      <Form onSubmit={handleSubmit}>
        
    <Form.Group className="form-group">
      <Form.Label className="form-label">Title</Form.Label>
      <Form.Control
        type="text"
        name="title"
        value={listing.title}
        onChange={handleChange}
        className="form-control"
        required
      />
  </Form.Group>

  {/* City and State Field */}
  <Form.Group className="form-group">
      <Form.Label className="form-label">City & State</Form.Label>
      <Form.Control
        type="text"
        name="cityState"
        value={listing.cityState}
        onChange={handleChange}
        className="form-control"
        required
      />
  </Form.Group>

  <Form.Group className="form-group">
      <Form.Label className="form-label">Tags (comma-seperated)</Form.Label>
      <Form.Control
        type="text"
        name="tags"
        value={listing.tags}
        onChange={handleChange}
        className="form-control"
      />
  </Form.Group>
  <Form.Group className="form-group">
      <Form.Label className="form-label">Description</Form.Label>
      <Form.Control
        type="textarea"
        name="description"
        value={listing.description}
        onChange={handleChange}
        className="form-control"
      />
  </Form.Group>




  <Form.Group className="form-group">
      <Form.Label className="form-label">Upload New Images</Form.Label>
      <Form.Control
        type="file"
        multiple
        onChange={handleNewImageChange}
      />
  </Form.Group>


  {/* Buttons */}
  <Row className="mt-4">
  <Button variant="primary" type="submit" className="custom-button my-3">Update Listing</Button>
  <Button variant="primary" onClick={handleDelete} className="custom-button my-3">Delete Listing</Button>   
      
  </Row>
</Form>


    </Container>
  );
};

export default EditListingPage;
