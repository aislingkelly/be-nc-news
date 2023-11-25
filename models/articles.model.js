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

exports.selectCommentsByArticleId = (id, limit = 10, p = 1) => {
  let queryString = `SELECT 
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
            comments.created_at DESC `;

  if (!isNaN(Number(limit))) {
    queryString += `LIMIT ${limit} `;
  } else {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  if (!isNaN(Number(p))) {
    p = (p - 1) * limit;
    queryString += `OFFSET ${p} `;
  } else {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  return db.query(queryString, [id]).then(({ rows }) => {
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

exports.insertArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = 'https://placehold.co/700x700'
) => {
  if (!body || !author || !topic || !title) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }
  return db
    .query(
      `WITH inserted_article AS (
    INSERT INTO articles (body, title, topic, author, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
)
SELECT
    inserted_article.author,
    inserted_article.title,
    inserted_article.body,
    inserted_article.article_id,
    inserted_article.topic,
    inserted_article.created_at,
    inserted_article.votes,
    inserted_article.article_img_url,
    CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
FROM
    inserted_article
LEFT JOIN comments ON inserted_article.article_id = comments.article_id
GROUP BY inserted_article.author, inserted_article.title, inserted_article.body, inserted_article.article_id, inserted_article.topic, inserted_article.created_at, inserted_article.votes, inserted_article.article_img_url;
`,
      [body, title, topic, author, article_img_url]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.deleteArticle = (article_id) => {
  return db
    .query('DELETE FROM articles WHERE article_id = $1 RETURNING *;', [
      article_id,
    ])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `article does not exist`,
        });
      }
    });
};

exports.selectArticles = (
  topic,
  order = 'desc',
  sort_by = 'created_at',
  limit = 10,
  p = 1
) => {
  const validSortByValues = [
    'created_at',
    'comment_count',
    'votes',
    'article_id',
  ];
  const validOrderValues = ['desc', 'asc'];

  if (
    (sort_by && !validSortByValues.includes(sort_by)) ||
    !validOrderValues.includes(order) ||
    isNaN(Number(limit)) ||
    isNaN(Number(p))
  ) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  p = (p - 1) * limit;

  let countQuery = `SELECT COUNT(article_id) AS total_count FROM articles`;
  const values = [];

  if (topic) {
    countQuery += ` WHERE topic = $1`;
    values.push(topic);
  }

  return db.query(countQuery, values).then((countResult) => {
    const totalCount = countResult.rows[0].total_count;

    let articlesQuery = `SELECT author, title, article_id, topic, created_at, votes, article_img_url,
      CAST((SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS INTEGER) AS comment_count
      FROM articles`;

    if (topic) {
      articlesQuery += ` WHERE topic = $1`;
    }
    articlesQuery += ` ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${p} `;

    return db.query(articlesQuery, values).then((articlesResult) => {
      return {
        articles: articlesResult.rows,
        total_count: Number(totalCount),
      };
    });
  });
};
