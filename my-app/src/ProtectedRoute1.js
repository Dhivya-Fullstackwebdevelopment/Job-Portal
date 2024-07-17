// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext1';

const ProtectedRoute1 = ({ element }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated() ? (
        <Route element={element} />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute1;
