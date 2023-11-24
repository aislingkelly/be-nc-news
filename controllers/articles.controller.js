const {
  selectArticleById,
  selectArticles,
  updateArticle,
  selectCommentsByArticleId,
  insertComment,
  insertArticle,
  deleteArticle,
} = require('../models/articles.model');
const { deleteCommentsByArticleId } = require('../models/comments.model');

const { checkTopicExists } = require('../models/topics.model');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;
  const articlePromises = [selectArticles(topic, order, sort_by, limit, p)];
  if (topic) {
    articlePromises.push(checkTopicExists(topic));
  }
  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];

      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticle(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const commentPromises = [
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id, limit, p),
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

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteCommentsByArticleId(article_id)
    .then(() => deleteArticle(article_id))
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
