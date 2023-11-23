const app = require('../app');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe('/api/topics', () => {
  test('GET: 200 an array of topic objects the same length as the test data', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(3);
      });
  });
  test('GET: 200 the first returned topic matches test data', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body[0]).toMatchObject({
          slug: 'mitch',
          description: 'The man, the Mitch, the legend',
        });
      });
  });
  test('GET: 200 topics have the properties 1. slug 2.description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const topics = body;
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test('GET: 404 endpoint not available', () => {
    return request(app)
      .get('/api/nopenopenope')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('path not found');
      });
  });
});

describe('/api/articles', () => {
  test('GET: 200 sends an array of article objects the same length as the test data', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(13);
      });
  });

  test('GET: 200 sent articles have the required proerties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty('body');
        });
      });
  });
  test('GET: 200 sends an array of sorted articles by date DESC by default', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});
describe('/api/articles?topic', () => {
  test('GET 200: responds only with articles of a given topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch');
        });
        expect(body.articles.length).toBe(12);
      });
  });
  test('GET 404: sends an error when topic does not exists', () => {
    return request(app)
      .get('/api/articles?topic=not_mitch')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('not a valid topic');
      });
  });
  test('GET 200: responds with an empty array if there are no articles associated with topic', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});
describe('/api/articles/:article_id', () => {
  test('GET: 200 sends a single article to the client', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test('GET: 200 sends a single article with the comment count property to the client', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty('comment_count');
      });
  });

  test('GET: 404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('GET: 400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('PATCH: 200 updates the requested article by increasing votes', () => {
    const updateVotesBy = { inc_votes: 99 };
    return request(app)
      .patch('/api/articles/1')
      .send(updateVotesBy)
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.updatedArticle;
        expect(updatedArticle.votes).toBe(199);
      });
  });
  test('PATCH: 200 updates the requested article by decrementing votes, can go into negative numbers', () => {
    const updateVotesBy = { inc_votes: -200 };
    return request(app)
      .patch('/api/articles/1')
      .send(updateVotesBy)
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.updatedArticle;
        expect(updatedArticle.votes).toBe(-100);
      });
  });
  test('PATCH: 200 sends the updated article to the client', () => {
    const updateVotesBy = { inc_votes: 99 };
    return request(app)
      .patch('/api/articles/1')
      .send(updateVotesBy)
      .expect(200)
      .then((response) => {
        const expectedObject = {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 199,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        };
        expect(response.body.updatedArticle).toEqual(expectedObject);
      });
  });
  test('PATCH: 404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    const updateVotesBy = { inc_votes: -200 };
    return request(app)
      .patch('/api/articles/999')
      .send(updateVotesBy)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('PATCH: 400 sends an appropriate status and error message when given an invalid id', () => {
    const updateVotesBy = { inc_votes: -200 };
    return request(app)
      .patch('/api/articles/not-an-article')
      .send(updateVotesBy)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('PATCH: 400 sends an appropriate status and error message when given invalid input - in_votes not an integer', () => {
    const updateVotesBy = { inc_votes: 'banana' };
    return request(app)
      .patch('/api/articles/1')
      .send(updateVotesBy)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('invalid vote');
      });
  });
});

describe('/api/articles/:article_id/comments', () => {
  test('GET: 200 sends an array of comments for the given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(11);
      });
  });

  test('GET: 200 sent comments have the required proerties', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const articles = body.comments;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test('GET: 200 sends an array of sorted comments by date DESC by default', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
  test('GET: 200 sends an empty array if the article exists but there are no associated comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test('GET: 404 sends an appropriate status and error message when the article does not exist', () => {
    return request(app)
      .get('/api/articles/99999/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('GET: 400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/katherine/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });

  test('POST: 201 inserts a new comment to the db and sends the comment back to the client', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'My lame comment blah blah blah',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe('My lame comment blah blah blah');
        expect(comment.author).toBe('butter_bridge');
      });
  });
  test('POST: 201 inserts a new comment with all the correct fields', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'My lame comment blah blah blah',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        });
      });
  });

  test('POST: 400 responds with an appropriate status and error message when given an invalid id', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'My lame comment blah blah blah',
    };
    return request(app)
      .post('/api/articles/katherine/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'My lame comment blah blah blah',
    };
    return request(app)
      .post('/api/articles/999/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('POST: 404 sends an appropriate status and error message when user does not exist', () => {
    const newComment = {
      username: 'not_today_buddy',
      body: 'My lame comment blah blah blah',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('user does not exist');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no comment body', () => {
    const newComment = {
      username: 'butter_bridge',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no comment username', () => {
    const newComment = {
      body: 'My lame comment blah blah blah',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
});

describe('/api/users', () => {
  test('GET: 200 an array of user objects the same length as the test data', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(4);
      });
  });

  test('GET: 200 users have the required properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const users = body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('/api/comments/:comment_id', () => {
  test('DELETE: 204 deletes the specified team and sends no body back', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });
  test('DELETE: 404 sends an appropriate status and error message when given a non-existent id', () => {
    return request(app)
      .delete('/api/comments/99999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('comment does not exist');
      });
  });
  test('DELETE: 400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/comments/not-a-comment')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
});

////////////Sorting and ordering tests

describe('/api/articles?sort_by=value&order=value', () => {
  test('GET: 200 sends an array of sorted articles by votes DESC by default', () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('votes', {
          descending: true,
        });
      });
  });
  test('GET: 200 sends an array of sorted articles by created_at DESC by default', () => {
    return request(app)
      .get('/api/articles?sort_by=created_at')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
  test('GET: 200 sends an array of sorted articles by comment_count DESC by default', () => {
    return request(app)
      .get('/api/articles?sort_by=comment_count')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('comment_count', {
          descending: true,
        });
      });
  });
  test('GET: 200 sends an array of sorted articles by article_id DESC by default', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('article_id', {
          descending: true,
        });
      });
  });
  test('GET: 200 sends an array of sorted articles by comment_count ASC by query', () => {
    return request(app)
      .get('/api/articles?sort_by=comment_count&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('comment_count', {
          ascending: true,
        });
      });
  });
  test('GET: 200 sends an array of sorted articles by article_id ASC by query', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('article_id', {
          ascending: true,
        });
      });
  });
  test('GET: 200 sends an array of sorted articles by date default ASC by query', () => {
    return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', {
          ascending: true,
        });
      });
  });
  test('GET: 400 bad request if sort_by option does not exist', () => {
    return request(app)
      .get('/api/articles?sort_by=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('GET: 400 bad request if order value does not exist', () => {
    return request(app)
      .get('/api/articles?order=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
});
