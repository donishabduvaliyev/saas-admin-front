import React from 'react'
import useAuthStore from '../store/auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuthStore();
    if (!user) {
        console.log("User not authenticated, redirecting to login.");
        console.log("Required role:", role);
        console.log("Current user:", user);


        return <Navigate to="/login" replace />;
    }


    if (role && user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
}

export default ProtectedRoute