const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const app = express();
const {
  handleCustomErrors,
  handleserverErrors,
  handle404Errors,
  handlePsqlErrors,
} = require('./errors');
const { getArticleById } = require('./controllers/articles.controller');

app.use(express.json());

// --- Endpoints --- //

// Topics endpoint
app.get('/api/topics', getTopics);

// Articles endpoints
app.get('/api/articles/:article_id', getArticleById);

// --- Handle Errors --- //

// 404 for not a path
app.all('*', handle404Errors);
// Other error handling
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleserverErrors);

module.exports = app;
