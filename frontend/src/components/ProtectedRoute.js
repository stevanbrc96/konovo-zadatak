import React from 'react';
import {Navigate} from 'react-router-dom';


function ProtectedRoute({children}) {
    const token = localStorage.getItem('jwt');

    if (!token) {

        return <Navigate to="/login"/>;
    }


    return children;
}

export default ProtectedRoute;