import React from 'react';
import AuthShield from './AuthShield';
import { isSessionValid, createSession, validatePassword } from './SessionManager';

const SecurityPage = ({ onAuthenticated }) => {

  if (isSessionValid()) {
    onAuthenticated();
    return null;
  }

  const handleAuthenticate = (password) => {
    if (validatePassword(password)) {
      createSession();
      onAuthenticated();
    } else {
      alert('Incorrect password'); // Use better error handling here.
    }
  };

  return <AuthShield onAuthenticate={handleAuthenticate} />;
};

export default SecurityPage;
