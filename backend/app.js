const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware for logging, error handling, and 404
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

app.use(requestLogger);

// Import routes
const dictionaryRoute = require('./routes/dictionary');
const writingRoute = require('./routes/writing');
const chatbotRoute = require('./routes/chatbot');
const assignmentRoute = require('./routes/assignment');
const matchingRoute = require('./routes/matching');

// Use routes
app.use('/api/dictionary', dictionaryRoute);
app.use('/api/writing', writingRoute);
app.use('/api/chatbot', chatbotRoute);
app.use('/api/assignment', assignmentRoute);
app.use('/api/matching', matchingRoute);

// 404 + error handler tập trung
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}



module.exports = app;
