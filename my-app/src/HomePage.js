// HomePage.js

import React from 'react';
import './HomePage.css'; // Ensure the CSS file path is correct
import { Link } from 'react-router-dom';
import Footer from './Footer'; // Import Footer component

import jobImage from './jobs2.jpg';

const HomePage = () => {
    return (
        <div className="container">
            <div className="grid-container">
                <div className="text">
                    <h1>Welcome to Job Portal</h1>
             
                    <p>Find your dream job and apply now!</p>
                    <Link to="/jobs" className="btn btn-primary">Search Jobs</Link>
                    <Link to="/JobRegistrationForm" className="btn btn-primary">Post Jobs</Link>
                </div>
                <div className="image-container">
                    <img src={jobImage} alt="A job seeker looking for opportunities" />
                </div>
            </div>

            {/* Footer section */}
            <Footer />
        </div>
    );
};

export default HomePage;
