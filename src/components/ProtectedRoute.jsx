import React from 'react'
import useAuthStore from '../store/auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuthStore();
    if (!user) {
        return <Navigate to="/login" replace />;
    }


    if (role && user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
}

export default ProtectedRoute