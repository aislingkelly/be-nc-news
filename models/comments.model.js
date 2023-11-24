const db = require('../db/connection.js');

exports.deleteComment = (comment_id) => {
  return db
    .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [
      comment_id,
    ])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `comment does not exist`,
        });
      }
    });
};

exports.updateComment = (comment_id, inc_votes) => {
  if (!Number.isInteger(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: 'invalid vote',
    });
  }

  return db
    .query(
      `UPDATE comments
      SET votes = votes+$2
      WHERE comment_id = $1
      RETURNING *;`,
      [comment_id, inc_votes]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: 'comment does not exist' });
      }
      return result.rows[0];
    });
};

exports.deleteCommentsByArticleId = (article_id) => {
  return db.query('DELETE FROM comments WHERE article_id = $1 RETURNING *;', [
    article_id,
  ]);
};
