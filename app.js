const express = require('express');
const cors = require('cors');
const app = express();

// Import the apiRouter
const apiRouter = require('./routes/api-router');

app.use(cors());

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
