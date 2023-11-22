const {
  selectArticleById,
  selectArticles,
  updateArticle,
} = require('../models/articles.model');

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  selectArticles(topic)
    .then((articles) => {
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
