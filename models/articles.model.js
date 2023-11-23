const db = require('../db/connection.js');

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT
            articles.author,
            articles.title,
            articles.body,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
        FROM
            articles
        LEFT JOIN comments 
            ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY
            articles.article_id
        ORDER BY  
            articles.created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      }
      return rows[0];
    });
};

exports.selectArticles = (topic, order, sort_by) => {
  const validSortByValues = [
    'created_at',
    'comment_count',
    'votes',
    'article_id',
  ];
  const validOrderValues = ['desc', 'asc'];
  const values = [];
  let queryString = `
        SELECT
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
        FROM
            articles
        LEFT JOIN comments
            ON articles.article_id = comments.article_id `;

  if (topic) {
    queryString += `WHERE topic = $1 `;
    values.push(topic);
  }

  queryString += `
        GROUP BY
            articles.article_id `;

  if (sort_by && !validSortByValues.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  } else if (order && !validOrderValues.includes(order)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  } else if (sort_by === 'comment_count') {
    queryString += `ORDER BY COUNT(comments.comment_id) `;
  } else if (sort_by) {
    queryString += `ORDER BY articles.${sort_by} `;
  } else {
    queryString += `ORDER BY
            articles.created_at `;
  }

  if (order) {
    queryString += `${order} `;
  } else {
    queryString += `DESC `;
  }

  return db.query(queryString, values).then((result) => {
    return result.rows;
  });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (!Number.isInteger(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: 'invalid vote',
    });
  }

  return db
    .query(
      `UPDATE articles
      SET votes = votes+$2
      WHERE article_id = $1
      RETURNING *;`,
      [article_id, inc_votes]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      }
      return result.rows[0];
    });
};

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
