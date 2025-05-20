import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(process.env.REACT_APP_API_BASE_URL, { withCredentials: true });

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.error('No user found! Redirecting to login...');
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (!user || !user.username) return;
    socket.emit('registerUser', user.username);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users?currentUser=${encodeURIComponent(user.username)}`)
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

  useEffect(() => {
    const privateMessageListener = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };
    socket.on('privateMessage', privateMessageListener);

    return () => {
      socket.off('privateMessage', privateMessageListener);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/chat/upload`, formData); // Match backend URL
      const imageUrl = res.data.url;

      if (imageUrl) {

        const imageMessage = {
          sender: user.username,
          recipient: selectedUser.username,
          image: imageUrl,
        };

        socket.emit('sendPrivateMessage', imageMessage);
        setMessages((prev) => [...prev, { ...imageMessage, self: true }]);
      } else {
        console.error("NO image url returned from the server.");
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  return (
    <div className="flex h-screen bg-[url('https://img.freepik.com/free-vector/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg')] bg-cover bg-center">
      {/* Sidebar */}
      <div className="w-1/4 p-4 border-r border-blue-400/20 bg-gray-900/80 backdrop-blur-sm shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-white">Users</h3>
        <ul className="space-y-2 overflow-y-auto h-[85vh]">
          {users.length > 0 ? (
            users.map((u) => (
              <li
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`cursor-pointer p-2 rounded-md transition-colors ${selectedUser && u.username === selectedUser.username
                    ? 'bg-blue-600/50 text-white font-semibold'
                    : 'text-blue-100 hover:bg-gray-800/70'
                  }`}
              >
                {u.username}
              </li>
            ))
          ) : (
            <p className="text-blue-100">No users available</p>
          )}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="w-3/4 flex flex-col p-4">
        <div className="flex-grow overflow-y-auto mb-4 space-y-2 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-blue-400/20">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-xl text-sm break-words ${msg.self
                  ? 'ml-auto bg-blue-600/50 text-white'
                  : 'mr-auto bg-gray-800/70 text-blue-100'
                }`}
            >
              <strong>{msg.sender}:</strong>
              {msg.text && <p>{msg.text}</p>}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="sent-img"
                  className="mt-2 max-w-full rounded-lg"
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg bg-gray-800/70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-blue-200/50"
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-2 text-blue-300 hover:text-white transition-colors"
          >
            📷
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
