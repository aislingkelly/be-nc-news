const db = require('../db/connection.js');

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT 
            comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id
        FROM 
            articles 
        JOIN 
            comments 
        ON 
            articles.article_id = comments.article_id
        WHERE 
            articles.article_id = $1
        ORDER BY  
            comments.created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (username, body, article_id) => {
  if (!body || !username) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }
  return db
    .query(
      'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
