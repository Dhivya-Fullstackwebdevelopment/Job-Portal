// AdminRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext1';

const AdminRoute1 = ({ element }) => {
    const { user } = useAuth();

    return user && user.role === 'admin' ? (
        <Route element={element} />
    ) : (
        <Navigate to="/" replace />
    );
};

export default AdminRoute1;
