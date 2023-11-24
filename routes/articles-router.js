const express = require('express');
const router = express.Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
  postArticle,
  deleteArticleById,
} = require('../controllers/articles.controller');

router.route('/').get(getArticles).post(postArticle);

router
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

router
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = router;
