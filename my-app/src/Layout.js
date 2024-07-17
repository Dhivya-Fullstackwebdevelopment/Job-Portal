// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './dreamjob.jpg';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <div className="header-container">
          <div className="logo-container">
            <Link to="/">
              <img src={logo} alt="dreamjob" className="logo" />
            </Link>
            <span className="logo-text">Dream Job</span>
          </div>
          <nav>
            <ul>
            <li><Link to="/"></Link></li>
            <li><Link to="/Login">Login</Link></li>
              <li><Link to="/HomePage">Home Page</Link></li>
              
              <li><Link to="/jobs">Search Jobs</Link></li>
              <li><Link to="/JobRegistrationForm">Post Jobs</Link></li>
              
            </ul>
          </nav>
        </div>
      </header>
      <main>{children}</main>
     
    </div>
  );
};

export default Layout;
