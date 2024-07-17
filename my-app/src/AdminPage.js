import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');

    const { login, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setUsernameError('');
        setPasswordError('');
        setLoginError('');

        // Validate fields
        let isValid = true;

        const whitespaceRegex = /^\s*$/;

        if (!username || whitespaceRegex.test(username)) {
            setUsernameError('*Username is required');
            isValid = false;
        }

        if (!password || whitespaceRegex.test(password)) {
            setPasswordError('*Password is required');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await axios.post('http://localhost:3000/admin', { username, password });
                if (response.status === 200) {
                    login(username, password);
                    navigate('/jobs'); // Redirect to JobRegistrationForm under AdminPage
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setLoginError('Invalid username or password');
                } else {
                    setLoginError('An error occurred while logging in. Please try again later.');
                }
            }
        }
    };

    const handleAdminLogout = () => {
        logout();
        navigate('/admin'); // Redirect to login page after logout
    };
  
    if (isAuthenticated && isAdmin) {
        navigate('/jobs');
        return null; // Render nothing while redirecting
    }

    return (
        <div className="admin-login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameError && <p className="error">{usernameError}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <p className="error">{passwordError}</p>}
                </div>
                <button type="submit">Login</button>
                {loginError && <p className="error">{loginError}</p>}
            </form>
            {isAuthenticated && isAdmin && (
                <button onClick={handleAdminLogout}>Admin Logout</button>
            )}
        </div>
    );
};


export default AdminPage;
