import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Make sure the path is correct
import { useNavigate } from 'react-router-dom';
import './ManageListingPage.css';


const ManageListingsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [listings, setListings] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [newListing, setNewListing] = useState({
    title: '',
    cityState: '',
    tags: '',
    description: '', // Added a description field
    pictures: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission status

  const fetchListings = async () => {
    const querySnapshot = await getDocs(collection(db, 'listings'));
    setListings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    fetchListings(); // Optionally refetch listings when the modal closes
  };

  const handleChange = ({ target: { name, value } }) => {
    setNewListing({ ...newListing, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleImageUpload = async () => {
    const uploadPromises = Array.from(imageFiles).map(file => {
      const fileRef = ref(storage, `listings/${Date.now()}_${file.name}`);
      return uploadBytes(fileRef, file).then(snapshot => getDownloadURL(snapshot.ref));
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true); // Disable the button as we start the upload process

    try {
      const imageUrls = await handleImageUpload();
      await addDoc(collection(db, 'listings'), {
        ...newListing,
        tags: newListing.tags.split(',').map(tag => tag.trim()),
        pictures: imageUrls,
        description: newListing.description.trim(), // Save the description
      });
      handleCloseModal();
      setNewListing({ title: '', cityState: '', tags: '', description: '', pictures: [] }); // Reset the state
      setImageFiles([]);
    } catch (error) {
      console.error('Error adding listing: ', error);
    }

    setIsSaving(false); // Enable the button after the process is complete
  };

  const handleListingClick = (id) => {
    navigate(`/manage/edit/${id}`);
  };

  return (
    <Container>
      <Button variant="primary" onClick={handleShowModal} className="custom-button my-3">
        + Add Listing
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
        <h2 className="about-title">Add New Listing</h2>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Form Group for Title */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                value={newListing.title}
                onChange={handleChange}
              />
            </Form.Group>
            
            {/* Form Group for City & State */}
            <Form.Group className="mb-3">
              <Form.Label>City and State</Form.Label>
              <Form.Control
                type="text"
                name="cityState"
                required
                value={newListing.cityState}
                onChange={handleChange}
              />
            </Form.Group>
            
            {/* Form Group for Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={newListing.tags}
                onChange={handleChange}
              />
            </Form.Group>
            
            {/* Form Group for Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                required
                value={newListing.description}
                onChange={handleChange}
              />
            </Form.Group>
            
            {/* Form Group for Image Upload */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="custom-button my-3" disabled={isSaving}>
                 Save Listing
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Row>
        {listings.map(listing => (
          <Col key={listing.id} md={4} className="mb-3">
            <Card onClick={() => handleListingClick(listing.id)} style={{ cursor: 'pointer' }}>
              <Card.Img variant="top" src={listing.pictures[0] || 'https://via.placeholder.com/150'} />
              <Card.Body>
                <Card.Title>{listing.title}</Card.Title>
                <Card.Text>{listing.cityState}</Card.Text>
                {/* Display tags and description */}
                <Card.Text>{listing.tags.join(', ')}</Card.Text>
                <Card.Text>{listing.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ManageListingsPage;
