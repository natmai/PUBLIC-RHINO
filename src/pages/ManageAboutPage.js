import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button, Form, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Ensure this path is correct
import './ManageAboutPage.css';

const ManageAboutMePage = () => {
  const [aboutMeData, setAboutMeData] = useState({
    firstName: '',
    lastName: '',
    contactLink: '',
    aboutDescription: '',
    contactImage: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const staticDocID = "singleUserAboutMe"; // A static ID for the document

  useEffect(() => {
    const fetchAboutMeData = async () => {
      const docRef = doc(db, 'aboutme', staticDocID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAboutMeData(docSnap.data());
      } else {
        console.log("Document does not exist, creating a new one with default values.");
        // You could initialize the document here if desired, or just leave it to the save function
      }
    };

    fetchAboutMeData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAboutMeData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Assuming single file upload
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null; // No file selected, return null

    // If there's an existing image, delete it first
    if (aboutMeData.contactImage) {
      const existingImageRef = ref(storage, aboutMeData.contactImage);
      await deleteObject(existingImageRef).catch(error => {
        console.error('Error deleting existing image:', error);
      });
    }

    const fileRef = ref(storage, `aboutmeImages/${imageFile.name}`);
    const snapshot = await uploadBytes(fileRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);
    return imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = await handleImageUpload(); // Upload image and get URL
    // Use existing image URL if no new image was uploaded
    imageUrl = imageUrl || aboutMeData.contactImage;
    const newData = { ...aboutMeData, contactImage: imageUrl };

    const docRef = doc(db, 'aboutme', staticDocID);
    await setDoc(docRef, newData, { merge: true });

    alert('About Me updated successfully!');
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col className="text-center">
          <h2>Edit About Me</h2>
        </Col>
      </Row>  

      <Form onSubmit={handleSubmit}>
      <Form.Group className="form-group">
        <Form.Label className="form-label">First Name</Form.Label>
       <Form.Control type="text" name="firstName" value={aboutMeData.firstName} onChange={handleInputChange} className="form-control" />
      </Form.Group>
      <Form.Group className="form-group">
    <Form.Label className="form-label">Last Name</Form.Label>
    <Form.Control type="text" name="lastName" value={aboutMeData.lastName} onChange={handleInputChange} className="form-control" />
</Form.Group>

<Form.Group className="form-group">
        <Form.Label className="form-label">Contact Link</Form.Label>
       <Form.Control type="text" name="contactLink" value={aboutMeData.contactLink} onChange={handleInputChange} className="form-control" />
      </Form.Group>
<Form.Group className="form-group">
        <Form.Label className="form-label">About Description</Form.Label>
        <Form.Control as="textarea" rows={3} name="aboutDescription" value={aboutMeData.aboutDescription} onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="form-group">
        <Form.Label className="form-label">Contact Image</Form.Label>
       <Form.Control type="file" onChange={handleImageChange} />
      </Form.Group>
  
      <Button variant="primary" type="submit" className="custom-button my-3">Save Changes</Button>
      </Form>
    </Container>
  );
};

export default ManageAboutMePage;
