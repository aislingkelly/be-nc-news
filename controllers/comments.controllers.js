const { deleteComment, updateComment } = require('../models/comments.model');

exports.deleteCommentsByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentsById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateComment(comment_id, inc_votes)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
