import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct
import './AboutPage.css';

const AboutPage = () => {
  const [aboutMeData, setAboutMeData] = useState({
    firstName: '',
    lastName: '',
    contactLink: '#', // Default to '#' or your preferred default contact link
    aboutDescription: '',
    contactImage: 'profile-placeholder.png', // Default profile image
  });
  const staticDocID = "singleUserAboutMe"; // The static ID for your document

  useEffect(() => {
    const fetchAboutMeData = async () => {
      const docRef = doc(db, 'aboutme', staticDocID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Update state with the fetched document data
        const data = docSnap.data();
        setAboutMeData({
          ...aboutMeData,
          firstName: data.firstName,
          lastName: data.lastName,
          contactLink: data.contactLink,
          aboutDescription: data.aboutDescription,
          contactImage: data.contactImage || 'profile-placeholder.png', // Fallback to default image if none provided
        });
      } else {
        console.log("No such document!");
      }
    };

    fetchAboutMeData();
  }, []);

  return (
    <div className="about-page-container">
      <section className="profile-section">
        <img src={aboutMeData.contactImage} alt="Profile" className="profile-picture"/>
        <h2 className="profile-name">{`${aboutMeData.firstName} ${aboutMeData.lastName}`}</h2>
        {/* Adjusted the button to be a link for contact; you might need to adjust its styling */}
        <a href={aboutMeData.contactLink} className="contact-button">Contact Me!</a>
      </section>
      <section className="about-section">
        <h2 className="about-title">About Me</h2>
        <p className="about-content">{aboutMeData.aboutDescription}</p>
      </section>
    </div>
  );
};

export default AboutPage;
