// src/pages/ManageRoutingPage.js
import React from 'react';
import ManageOptionCard from '../components/ManageOptionCard';
import './ManageRoutingPage.css';

const ManageRoutingPage = () => {
    return (
        <div className="manage-routing-page">
          <h1> </h1>
          <div className="options-container">
            <ManageOptionCard
              title="Manage About Me"
              description="Update your personal information or change your bio."

              navigateTo= '/ManageAbout'
            />
            <ManageOptionCard
              title="Manage Locations"
              description="Update your locations information or images."

              navigateTo= '/ManageListings'
            />
          </div>
        </div>
      );
};

export default ManageRoutingPage;
