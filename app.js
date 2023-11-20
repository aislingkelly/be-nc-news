const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const app = express();
const {
  handleCustomErrors,
  handleserverErrors,
  handle404Errors,
} = require('./errors');

app.use(express.json());

// --- Endpoints --- //

// Topics endpoint
app.get('/api/topics', getTopics);

// --- Handle Errors --- //

// 404 for not a path
app.all('*', handle404Errors);
// Other error handling
app.use(handleCustomErrors);
app.use(handleserverErrors);

module.exports = app;
