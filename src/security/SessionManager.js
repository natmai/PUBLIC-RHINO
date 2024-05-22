//const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SESSION_DURATION = 33 * 60 * 1000;

export const isSessionValid = () => {
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  return sessionExpiry && new Date().getTime() < sessionExpiry;
};

export const createSession = () => {
  const expiryTime = new Date().getTime() + SESSION_DURATION;
  localStorage.setItem('sessionExpiry', expiryTime);
};

export const endSession = () => {
  localStorage.removeItem('sessionExpiry');
};

export const validatePassword = (password) => {
  const correctPassword = 'yourPassword'; // Replace with secure password logic.
  return password === correctPassword;
};
