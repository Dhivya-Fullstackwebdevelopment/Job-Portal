// Footer.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from './dreamjob.jpg';
import './Footer.css';

const Footer = () => {
    const location = useLocation();

    // Check if current route is JobRegistrationForm
    if (location.pathname === '/JobRegistrationForm') {
        return null; // Return null to not render anything
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="left-content">
                    <div className="logo-container">
                        <img src={logo} alt="Footer Logo" className="footer-logo" />
                        <span className="logo-text">Dream Job</span>
                    </div>
                    <p className="copyright">© 2024 Dream Job. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;