// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const cors = require('cors');

// // Enable CORS for the frontend at localhost:3000
// app.use(cors({
//     origin: 'http://localhost:3000',  // Allow requests from localhost:3000
//     methods: ['GET', 'POST'],        // Allow only GET and POST requests
//     allowedHeaders: ['Content-Type'], // Allow specific headers
//   }));

// // Middleware
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// // Sample Route
// app.get('/', (req, res) => {
//     res.send('Chat App Backend is Running');
// });

// // Socket.IO Real-Time Communication
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('sendMessage', (message) => {
//         console.log('Message received:', message);
//         io.emit('receiveMessage', message); // Send message to all connected users
//     });

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// backend/server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const userRoutes = require('./routes/users');
// const authRoutes = require('./routes/auth');
// const Message = require('./models/Message');
// require('dotenv').config(); // Load environment variables

// // Initialize express and create a server
// const app = express();
// const server = http.createServer(app);

// // Middleware to handle CORS
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// // Initialize socket.io
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   },
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('MongoDB connected successfully');
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
// });

// // User route
// app.use('/users', userRoutes);

// // Serve static files if necessary
// app.use(express.static('public'));

// // Simple route to check server status
// app.get('/', (req, res) => {
//   res.send('Server is running');
// });
// app.use('/auth', authRoutes);

// // Handle socket connection
// const userSockets = {};

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('registerUser', (username) => {
//     userSockets[username] = socket.id;
//     socket.username=username;
//     console.log(`User registered: ${username}, Socket ID: ${socket.id}`);
//   });
// //Handle sending private messages
// socket.on('sendPrivateMessage', async ({ sender, recipient, text }) => {
//   if (!sender || !recipient || !text) {
//     console.error("Invalid message data:", { sender, recipient, text });
//     return;
//   }
// try{

//   // Save message to MongoDB
//   const message = new Message({ sender, recipient, text });
//   await message.save();
  
//   const recipientSocketId = userSockets[recipient];
//   if (recipientSocketId) {
//     io.to(recipientSocketId).emit('privateMessage', { sender, text });
//   } else {
//     console.log(`Recipient (${recipient}) not connected`);
//   }
// }catch(error){
//   console.error("Error saving message  : ",error );
// }
// });

//    // Fetch chat history for selected user
//    socket.on('fetchMessages', async ({ user1, user2 }) => {
//     try {
//       const messages = await Message.find({
//         $or: [
//           { sender: user1, recipient: user2 },
//           { sender: user2, recipient: user1 },
//         ],
//       }).sort({ timestamp: 1 });

//       socket.emit('messageHistory', messages);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   });
// //Handling user disconnect
//   socket.on('disconnect', () => {
//     for (const [username, socketId] of Object.entries(userSockets)) {
//       if (socketId === socket.id) {
//         delete userSockets[username];
//         console.log(`User disconnected: ${username}`);
//         break;
//       }
//     }
//   });
// });

// // Set the port and start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// 3rdcode
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const Message = require('./models/Message');
require('dotenv').config();
const chatRoutes = require('./routes/chat');//for image upload

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ['http://localhost:3000','http://192.168.0.100:3000'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/chat',chatRoutes);


const io = socketIo(server, {
  cors: { origin: ["http://localhost:3000",'http://192.168.0.100:3000'], methods: ['GET', 'POST'], credentials: true },
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const userSockets = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('registerUser', (username) => {
    if (!username) return;
    userSockets[username] = socket.id;
    console.log(`User registered: ${username} (Socket ID: ${socket.id})`);
  });

  socket.on('sendPrivateMessage', async ({ sender, recipient, text, image }) => {
    if (!sender || !recipient || (!text && !image)) {
      console.error("Invalid message data:", { sender, recipient, text, image });
      return;
    }
  
    try {
      const newMessage = new Message({ 
        chatId: `${sender}_${recipient}`, 
        sender, 
        recipient,   // Ensure recipient is included here
        text: text || '',
        image: image || '',
      });
      await newMessage.save();
  
      const recipientSocketId = userSockets[recipient];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('privateMessage', { sender, recipient, text,image });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on('fetchMessages', async ({ user1, user2 }) => {
    if (!user1 || !user2) return;
    try {
      const messages = await Message.find({
        $or: [
          { chatId: `${user1}_${user2}` },
          { chatId: `${user2}_${user1}` },
        ],
      }).sort({ timestamp: 1 });
      socket.emit('messageHistory', messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  socket.on('disconnect', () => {
    Object.entries(userSockets).forEach(([username, socketId]) => {
      if (socketId === socket.id) {
        console.log(`User disconnected: ${username}`);
        delete userSockets[username];
      }
    });
  });
});

server.listen(5000, '0.0.0.0',() => console.log(`Server running on port  0.0.0.0:5000`));
