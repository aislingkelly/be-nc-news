const express = require('express');
const app = express();

// Import the apiRouter
const apiRouter = require('./routes/api-router');

const {
  handleCustomErrors,
  handleserverErrors,
  handle404Errors,
  handlePsqlErrors,
} = require('./errors');

app.use(express.json());

// Use the apiRouter for all '/api' routes
app.use('/api', apiRouter);

// Error handling
app.all('*', handle404Errors);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleserverErrors);

module.exports = app;
