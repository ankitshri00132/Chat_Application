// import React from 'react';
// import { Navigate } from 'react-router-dom';

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem('token');

//   if (!token) {
//     // Redirect to login if token is not found
//     return <Navigate to="/login" />;
//   }

//   return children;
// }

// export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Or get it from context/state

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Pass currentUser to children
  return React.cloneElement(children, { currentUser });
};

export default ProtectedRoute;
