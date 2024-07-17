import React from 'react';
import { Link } from 'react-router-dom';
import logo from './dreamjob.jpg';
import { useAuth } from './AuthContext';
import { useAuth1 } from './AuthContext1';

const Header = () => {
    const { isAuthenticated, logout, username } = useAuth();
    const { isAdmin } = useAuth1();

    const handleLogout = () => {
        logout();
    };

    const handleAdminLogout = () => {
        logout();
        // Redirect to admin login page after logout
    };

    return (
        <Header>
            <div className="header-container">
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="dreamjob" className="logo" />
                    </Link>
                    <span className="logo-text">Dream Job</span>
                </div>
                <nav>
                    <ul>
                        {isAuthenticated ? (
                            <>
                                {isAdmin ? (
                                    <>
                                        <li><Link to="/admin">Admin</Link></li>
                                        <li className="username">Welcome, {username}</li> {/* Display the username */}
                                        <li><Link to="/login" onClick={handleAdminLogout}>Admin Logout</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/">Home Page</Link></li>
                                        <li><Link to="/jobs">Search Jobs</Link></li>
                                        <li><Link to="/JobRegistrationForm">Post Jobs</Link></li>
                                        <li><Link to="/admin">Admin</Link></li>
                                        <li className="username">Welcome, {username}</li> {/* Display the username */}
                                        <li><Link to="/JobRegistrationFormFetch">JobDetails</Link></li>
                                        <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/loginn">Company Login</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </Header>
    );
};

export default Header;
