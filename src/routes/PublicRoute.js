import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const location = useLocation();

    if (isLoggedIn) {
        const redirectTo = location.state?.from?.pathname || '/';
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
