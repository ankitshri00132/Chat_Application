// import React from 'react';
// import Chat from './components/Chat';  // Assuming Chat.js is in the 'components' folder

// function App() {
//   return (
//     <div>
//       <h1>Chat Application</h1>
//       <Chat />
//     </div>
//   );
// }

// export default App; 2nd one
// import React from 'react';
// import Chat from './components/Chat';


// function App() {
//   return (
//     <div style={styles.appContainer}>
//       <header style={styles.header}>
//         <h1 style={styles.title}>Welcome to ChatApp</h1>
//       </header>
//       <main style={styles.mainContent}>
//         <Chat />
//       </main>
//       <footer style={styles.footer}>
//         <p>© 2025 ChatApp. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;

// // CSS-in-JS for styling the App.js components
// const styles = {
//   appContainer: {
//     fontFamily: `'Arial', sans-serif`,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100vh',
//     margin: 0,
//     padding: 0,
//     backgroundColor: '#f3f4f6',
//   },
//   header: {
//     width: '100%',
//     padding: '20px',
//     backgroundColor: '#4CAF50',
//     color: '#fff',
//     textAlign: 'center',
//     boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//   },
//   title: {
//     margin: 0,
//     fontSize: '2rem',
//   },
//   mainContent: {
//     flex: 1,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     padding: '20px',
//   },
//   footer: {
//     width: '100%',
//     padding: '10px 20px',
//     backgroundColor: '#333',
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: '0.9rem',
//   },
// };


//3rd one with all the login and registration and protected route component

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
