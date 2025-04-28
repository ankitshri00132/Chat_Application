// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Backend server URL

// function Chat() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Listening for messages from the server
//     socket.on('message', (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     // Clean up the listener when the component is unmounted
//     return () => socket.off('message');
//   }, []);

//   const handleMessageSend = () => {
//     if (message) {
//       const messageToSend = { text: message };
//       console.log('Sending message:', messageToSend);
//       socket.emit('sendMessage', messageToSend); // Emit the message to the server
//       setMessage(''); // Clear the input after sending
//     }
//   };

//   return (
//     <div style={styles.chatContainer}>
//       <div style={styles.messagesContainer}>
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index} style={styles.message}>
//               {msg.text}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message"
//         style={styles.input}
//       />
//       <button onClick={handleMessageSend} style={styles.sendButton}>
//         Send
//       </button>
//     </div>
//   );
// }

// export default Chat;

// // Simple CSS-in-JS for styling
// const styles = {
//   chatContainer: {
//     width: '400px',
//     margin: '20px auto',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     backgroundColor: '#f9f9f9',
//   },
//   messagesContainer: {
//     maxHeight: '300px',
//     overflowY: 'scroll',
//     marginBottom: '20px',
//   },
//   message: {
//     backgroundColor: '#d3f1fc',
//     padding: '10px',
//     margin: '5px 0',
//     borderRadius: '5px',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     fontSize: '16px',
//     marginBottom: '10px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//   },
//   sendButton: {
//     width: '100%',
//     padding: '10px',
//     backgroundColor: '#4CAF50',
//     color: '#fff',
//     fontSize: '16px',
//     border: 'none',
//     borderRadius: '5px',
//   },
// };

// 2nd code
// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Backend server URL

// function Chat({ currentUser }) {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Fallback for currentUser
//   // const user = currentUser || JSON.parse(localStorage.getItem('currentUser'));
//   const [user, setUser] = useState(null);

// useEffect(() => {
//   const storedUser = localStorage.getItem('currentUser');
//   if (storedUser) {
//     setUser(JSON.parse(storedUser));
//   } else {
//     console.error('No user found! Redirecting to login...');
//     window.location.href = '/login';
//   }
// }, []);

//   useEffect(() => {
//     if (!user || user.username) {
//       console.error('No current user found!');
//       return;
//     }
//     console.log('Current user:', user.username); // Debugging console log

//     // Register the user with the server
//     socket.emit('registerUser', user.username);

//     // Fetch the list of users from the server, excluding the current user
//     fetch(`http://localhost:5000/users?currentUser=${encodeURIComponent(user.username)}`, {
//       method: 'GET',
//       credentials: 'include',
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => setUsers(data.users))
//       .catch((err) => console.error('Error fetching users:', err));

//     // Listen for incoming messages
//     socket.on('privateMessage', (newMessage) => {
//       if (newMessage.sender === selectedUser?.username) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });

//     return () => {
//       socket.off('privateMessage');
//     };
//   }, [user, selectedUser]);

//   // Load chat history when selecting a user
//   useEffect(() => {
//     if (selectedUser) {
//       socket.emit('fetchMessages', { user1: user.username, user2: selectedUser.username });

//       socket.on('messageHistory', (fetchedMessages) => {
//         setMessages(fetchedMessages);
//       });

//       return () => {
//         socket.off('messageHistory');
//       };
//     }
//   }, [user,selectedUser]);//problem in code.. will be reviewed later..match with gpt code

//   // Scroll to the bottom of the messages
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (!message.trim()) {
//       alert('Message cannot be empty!');
//       return;
//     }
//     if (message && selectedUser && user) {
//       const messageToSend = {
//         text: message,
//         sender: user.username,
//         recipient: selectedUser.username,
//       };
//   socket.emit('sendPrivateMessage', messageToSend);
//       setMessages((prev) => [...prev, { ...messageToSend, self: true }]);
//       setMessage('');
//     } else {
//       console.error('Message or recipient is missing!');
//       alert('Please select a user to send a message.');
//     }
//   };

//   return (
//     <div style={styles.chatContainer}>
//       {/* Sidebar for User List */}
//       <div style={styles.sidebar}>
//         <h3>Users</h3>
//         <ul style={styles.userList}>
//           {users && users.length > 0 ? (
//             users.map((user) => (
//               <li
//                 key={user._id}
//                 style={
//                   selectedUser && user.username === selectedUser.username
//                     ? styles.activeUser
//                     : styles.userItem
//                 }
//                 onClick={() => setSelectedUser(user)}
//               >
//                 {user.username}
//               </li>
//             ))
//           ) : (
//             <p>Loading users...</p>
//           )}
//         </ul>
//       </div>

//       {/* Chat Box */}
//       <div style={styles.chatBox}>
//         <div style={styles.messagesContainer}>
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               style={msg.self ? styles.myMessage : styles.otherMessage}
//             >
//               <strong>{msg.sender}:</strong> {msg.text}
//             </div>
//           ))}
//           <div ref={messagesEndRef}></div>
//         </div>
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           style={styles.input}
//         />
//         <button onClick={handleSendMessage} style={styles.sendButton}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Chat;


// // Styling for Chat Component
// const styles = {
//   chatContainer: {
//     display: 'flex',
//     height: '100vh',
//   },
//   sidebar: {
//     width: '25%',
//     borderRight: '1px solid #ccc',
//     padding: '10px',
//     overflowY: 'auto',
//   },
//   chatBox: {
//     width: '75%',
//     display: 'flex',
//     flexDirection: 'column',
//     padding: '10px',
//   },
//   messagesContainer: {
//     flexGrow: 1,
//     overflowY: 'auto',
//     marginBottom: '10px',
//   },
//   userList: {
//     listStyleType: 'none',
//     padding: 0,
//   },
//   userItem: {
//     padding: '10px',
//     cursor: 'pointer',
//     borderBottom: '1px solid #ddd',
//     transition: 'background-color 0.2s ease',
//   },
//   activeUser: {
//     padding: '10px',
//     cursor: 'pointer',
//     backgroundColor: '#d3f1fc',
//     borderBottom: '1px solid #ddd',
//   },
//   myMessage: {
//     textAlign: 'right',
//     backgroundColor: '#d3f1fc',
//     padding: '10px',
//     margin: '5px 0',
//     borderRadius: '10px',
//     animation: 'fadeIn 0.5s ease',
//   },
//   otherMessage: {
//     textAlign: 'left',
//     backgroundColor: '#fcd3d3',
//     padding: '10px',
//     margin: '5px 0',
//     borderRadius: '10px',
//     animation: 'fadeIn 0.5s ease',
//   },
//   input: {
//     width: '98%',
//     padding: '10px',
//     marginBottom: '5px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//     transition: 'box-shadow 0.3s ease',
//   },
//   sendButton: {
//     padding: '10px',
//     backgroundColor: '#4CAF50',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     transition: 'transform 0.2s ease',
//   },
// };

// // 3rd code 
// Chat.js
// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', { withCredentials: true }); // Ensure proper connection

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Retrieve the current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.error('No user found! Redirecting to login...');
      window.location.href = '/login';
    }
  }, []);

  // Fetch user list and register user
  useEffect(() => {
    if (!user || !user.username) return;
    socket.emit('registerUser', user.username);

    fetch(`http://localhost:5000/users?currentUser=${encodeURIComponent(user.username)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, [user]);

  // Load chat history when selecting a user
  useEffect(() => {
    if (user && selectedUser) {
      socket.emit('fetchMessages', { user1: user.username, user2: selectedUser.username });

      const messageListener = (fetchedMessages) => {
        setMessages(fetchedMessages);
      };
      socket.on('messageHistory', messageListener);

      return () => {
        socket.off('messageHistory', messageListener);
      };
    }
  }, [user, selectedUser]);

  // Listen for incoming messages
  useEffect(() => {
    const privateMessageListener = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };
    socket.on('privateMessage', privateMessageListener);

    return () => {
      socket.off('privateMessage', privateMessageListener);
    };
  }, []);

  // Scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send private message
  const handleSendMessage = () => {
    if (!message.trim()) {
      alert('Message cannot be empty!');
      return;
    }
    if (user && selectedUser) {
      const messageToSend = {
        text: message,
        sender: user.username,
        recipient: selectedUser.username,
      };

      socket.emit('sendPrivateMessage', messageToSend);
      setMessages((prev) => [...prev, { ...messageToSend, self: true }]);
      setMessage('');
    } else {
      alert('Please select a user to send a message.');
    }
  };

  return (
    <div className="flex h-screen bg-blue-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-1/4 p-4 border-r border-gray-200 bg-white shadow-md">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <ul className="space-y-2 overflow-y-auto h-[85vh]">
          {users.length > 0 ? (
            users.map((u) => (
              <li
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`cursor-pointer p-2 rounded-md transition-colors ${
                  selectedUser && u.username === selectedUser.username
                    ? 'bg-blue-100 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                {u.username}
              </li>
            ))
          ) : (
            <p>No users available</p>
          )}
        </ul>
      </div>

      {/* Chat box */}
      <div className="w-3/4 flex flex-col p-4">
        <div className="flex-grow overflow-y-auto mb-4 space-y-2 bg-white rounded-2xl p-4 shadow-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-xl text-sm break-words ${
                msg.self
                  ? 'ml-auto bg-blue-100 text-right'
                  : 'mr-auto bg-gray-100 text-left'
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;