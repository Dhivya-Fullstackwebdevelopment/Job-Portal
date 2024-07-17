import React, { createContext, useContext, useState } from 'react';

const AuthContext1 = createContext();

export const useAuth1 = () => useContext(AuthContext1);

export const AuthProvider1 = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(isAdminUser);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('isAdmin');
    };

    const adminLogin = () => {
        localStorage.setItem('isAdmin', 'true');
        login();
    };

    const loginAsAdmin = () => {
        setIsAdmin(true);
    };

    const logoutAdmin = () => {
        setIsAdmin(false);
    };

    return (
        <AuthContext1.Provider value={{ isAuthenticated, isAdmin, login, logout, adminLogin, loginAsAdmin, logoutAdmin }}>
            {children}
        </AuthContext1.Provider>
    );
};
