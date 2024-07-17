import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const defaultAdmins = [
    { username: 'admin', password: 'admin123' },
    { username: 'dhivya', password: 'admin123' },
    { username: 'dinesh', password: 'admin123' },
    { username: 'admin3', password: 'admin123' },
    { username: 'admin4', password: 'admin123' },
];

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        const adminUser = defaultAdmins.find(admin => admin.username === storedUsername && admin.password === storedPassword);

        if (adminUser) {
            setIsAdmin(true);
            setIsAuthenticated(true);
            setUsername(storedUsername);
        } else if (storedUsername && storedPassword) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
        }
    }, []);

    const login = (username, password) => {
        const adminUser = defaultAdmins.find(admin => admin.username === username && admin.password === password);

        if (adminUser) {
            setIsAdmin(true);
        }
        setIsAuthenticated(true);
        setUsername(username);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUsername('');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
