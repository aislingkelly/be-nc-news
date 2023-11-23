const express = require('express');
const router = express.Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require('../controllers/articles.controller');

// Articles endpoints
router.get('/', getArticles);
router.get('/:article_id', getArticleById);
router.patch('/:article_id', patchArticleById);
router.get('/:article_id/comments', getCommentsByArticleId);
router.post('/:article_id/comments', postCommentsByArticleId);

module.exports = router;
