const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const app = express();
const {
  handleCustomErrors,
  handleserverErrors,
  handle404Errors,
} = require('./errors');

app.use(express.json());
app.get('/api/topics', getTopics);

// Catch 404 for undefined routes
app.all('*', handle404Errors);

// Error handling
app.use(handleCustomErrors);
app.use(handleserverErrors);

module.exports = app;
