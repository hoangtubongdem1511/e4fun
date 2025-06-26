const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const dictionaryRoute = require('./routes/dictionary');
const writingRoute = require('./routes/writing');
const chatbotRoute = require('./routes/chatbot');
const uploadRoute = require('./routes/upload');
const assignmentRoute = require('./routes/assignment');

// Use routes
app.use('/api/dictionary', dictionaryRoute);
app.use('/api/writing', writingRoute);
app.use('/api/chatbot', chatbotRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/assignment', assignmentRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
