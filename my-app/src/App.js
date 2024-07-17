import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import JobsGrid from './JobsGrid';
import Footer from './Footer';
import logo from './dreamjob.jpg';
import JobDetailPage from './JobDetailPage';
import EditJobPage from './EditJobPage';
import SignupForm from './SignupForm';
import LoginPage from './LoginPage';
import JobRegistrationForm from './JobRegistrationForm';
import AdminPage from './AdminPage';
import ProtectedRoute from './ProtectedRoute';
import PrivateRoute from './PrivateRoute';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthProvider1, useAuth1 } from './AuthContext1';
import './App.css';
import AdminSignupForm from './AdminSignupForm';
import AdminLoginForm from './AdminLoginForm';
import JobRegistrationFormFetch from './JobRegistrationFormFetch';

const App = () => {
    const { isAuthenticated, logout, username } = useAuth();
    const { isAdmin } = useAuth1();

    const handleLogout = () => {
        logout();
    };


    return (
        <Router>
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
                                {isAuthenticated ? (
                                    <>
                                        <li><Link to="/">Home Page</Link></li>
                                        <li><Link to="/jobs">Search Jobs</Link></li>
                                        <li><Link to="/JobRegistrationForm">Post Jobs</Link></li>
                                        <li><Link to="/JobRegistrationFormFetch">JobDetails</Link></li>
                                        {isAdmin && <li><Link to="/admin">Admin</Link></li>}
                                     
                                       
                                        
                                        {username && <li className="username">Welcome, {username}</li>} {/* Display the username */}
                                        <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
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
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/signupp" element={<AdminSignupForm />} />
                        <Route path="/loginn" element={<AdminLoginForm />} />
                        <Route path="/jobs" element={
                            <ProtectedRoute>
                                <JobsGrid />
                            </ProtectedRoute>
                        } />
                        <Route path="/JobRegistrationForm" element={
                            <PrivateRoute>
                                <JobRegistrationForm />
                            </PrivateRoute>
                        } />
                        <Route path="/JobRegistrationFormFetch" element={
                            <PrivateRoute>
                                <JobRegistrationFormFetch />
                            </PrivateRoute>
                        } />
                        <Route path="/jobs/:id" element={
                            <ProtectedRoute>
                                <JobDetailPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/jobs/:id/edit" element={
                            <ProtectedRoute>
                                <EditJobPage />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

const WrappedApp = () => (
    <AuthProvider>
        <AuthProvider1>
            <App />
        </AuthProvider1>
    </AuthProvider>
);

export default WrappedApp;
