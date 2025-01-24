const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const uri = "mongodb+srv://hamdihm708:HM1.10.2005@new.7wmro.mongodb.net/secret_chats?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const chatSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  messages: [{
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

const Chat = mongoose.model('Chat', chatSchema);

// Routes
app.post('/api/chats', async (req, res) => {
  try {
    const chat = new Chat();
    await chat.save();
    res.json({ chatId: chat.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const chat = await Chat.findOne({ id: req.params.chatId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    
    chat.messages.push({ message: req.body.message });
    await chat.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const chat = await Chat.findOne({ id: req.params.chatId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/chats', async (req, res) => {
  try {
    const chats = await Chat.find().select('id messages');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});