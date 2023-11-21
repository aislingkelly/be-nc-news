const { selectArticleById } = require('../models/articles.model');
const {
  selectCommentsByArticleId,
  insertComment,
} = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  // selectArticleById will reject if article does not exist
  const commentPromises = [
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id),
  ];

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments =
        resolvedPromises[1]; /* comments are the resolved promise of selectCommentsByArticleId(article_id) in commentPromises array*/
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const newComment = req.body;
  insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
