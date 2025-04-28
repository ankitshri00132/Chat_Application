const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },  // Ensure recipient field is here
  text: { type: String},
  image:{type:String},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
