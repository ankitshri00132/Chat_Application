import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  
  return (
    <>
    
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route for chat */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Chat/>
            </ProtectedRoute>
          } 
        />

        {/* Redirect to login if no match */}
        <Route path="*" element={<Navigate to="/login" />} />
      
      </Routes>
    </Router>
    </>
  );
}

export default App;
