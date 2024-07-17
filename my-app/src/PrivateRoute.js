import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth1 } from './AuthContext1';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth1();

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            const token = localStorage.getItem('adminToken');
            axios.get('http://localhost:3000/admin/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                console.log('Protected data:', response.data);
            }).catch(error => {
                console.error('Error accessing protected route:', error);
            });
        }
    }, [isAuthenticated, isAdmin]);

    if (!isAuthenticated) {
        return <Navigate to="/signupp" />;
    }

    return children;
};

export default ProtectedRoute;
