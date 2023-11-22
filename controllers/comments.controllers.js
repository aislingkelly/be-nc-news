const { selectArticleById } = require('../models/articles.model');

const {
  selectCommentsByArticleId,
  insertComment,
  deleteComment,
} = require('../models/comments.model');
const { selectUserByUsername } = require('../models/users.model');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentPromises = [
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id),
  ];

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[1];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const commentPromises = [
    selectArticleById(article_id),
    insertComment(username, body, article_id),
  ];

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[1];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentsByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
};
