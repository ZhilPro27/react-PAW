import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute = ({ auth }) => {
  const isAuthorized = auth.isLoggedIn && auth.role === 'admin';

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;