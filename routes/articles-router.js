const express = require('express');
const router = express.Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
  postArticle,
} = require('../controllers/articles.controller');

router.route('/').get(getArticles).post(postArticle);

router.route('/:article_id').get(getArticleById).patch(patchArticleById);

router
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = router;
