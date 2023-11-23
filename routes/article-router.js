const express = require('express');
const router = express.Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require('../controllers/articles.controller');

router.get('/', getArticles);

router.route('/:article_id').get(getArticleById).patch(patchArticleById);

router
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = router;
