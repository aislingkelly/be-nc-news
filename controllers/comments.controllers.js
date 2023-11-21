const { selectArticleById } = require('../models/articles.model');
const { selectCommentsByArticleId } = require('../models/comments.models');

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
