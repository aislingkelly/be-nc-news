const db = require('../db/connection.js');

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT username FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'user does not exist' });
      }
      return rows[0];
    });
};
