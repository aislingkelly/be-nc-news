const express = require('express');
const router = express.Router();

const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const topicsRouter = require('./topics-router');
const endpointsRouter = require('./endpoints-router');
const commentsRouter = require('./comments-router');

router.use('/', endpointsRouter);
router.use('/articles', articlesRouter);
router.use('/users', usersRouter);
router.use('/topics', topicsRouter);
router.use('/comments', commentsRouter);

module.exports = router;
