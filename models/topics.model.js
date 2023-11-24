const db = require('../db/connection.js');

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query('SELECT * FROM topics WHERE slug = $1;', [topic])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `not a valid topic`,
        });
      }
      return rows;
    });
};

exports.insertTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }
  return db
    .query(
      'INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;',
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};
