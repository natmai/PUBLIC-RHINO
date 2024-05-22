import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AuthShield = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    onAuthenticate(password);
  };

  return (
    <Modal show={true} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Authentication Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
        <Modal.Footer>
            <Button variant="primary" type="submit">
            Submit
            </Button>
        </Modal.Footer>
        </Form>
      </Modal.Body>

    </Modal>
  );
};

export default AuthShield;
