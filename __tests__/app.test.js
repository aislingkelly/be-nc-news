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

  test('POST: 201 inserts a new topic to the db and sends the topic back to the client', () => {
    const newTopic = {
      slug: 'a new slug',
      description: 'and description here',
    };
    return request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(201)
      .then((response) => {
        const topic = response.body.topic;
        expect(topic.slug).toBe('a new slug');
        expect(topic.description).toBe('and description here');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no slug', () => {
    const newTopic = {
      description: 'and description here',
    };
    return request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no description', () => {
    const newTopic = {
      slug: 'a new slug',
    };
    return request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
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
        expect(body.articles.length).toBe(10);
        expect(body.total_count).toEqual(13);
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
  test('POST: 201 inserts a new article to the db and sends the article back to the client', () => {
    const newArticle = {
      author: 'lurker',
      title: 'A great title',
      body: 'This is the body',
      topic: 'cats',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(14);
        expect(article.body).toBe('This is the body');
        expect(article.author).toBe('lurker');
      });
  });
  test('POST: 201 inserts a new article with all the correct fields', () => {
    const newArticle = {
      author: 'lurker',
      title: 'A great title',
      body: 'This is the body',
      topic: 'cats',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          topic: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test('POST: 201 inserts a new article with all the correct fields and default image', () => {
    const newArticle = {
      author: 'lurker',
      title: 'A great title',
      body: 'This is the body',
      topic: 'cats',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_img_url).toBe('https://placehold.co/700x700');
      });
  });

  test('POST: 404 sends an appropriate status and error message when author does not exist', () => {
    const newArticle = {
      author: 'not_today_buddy',
      title: 'A great title',
      body: 'This is the body',
      topic: 'cats',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 404 sends an appropriate status and error message when topic does not exist', () => {
    const newArticle = {
      author: 'not_today_buddy',
      title: 'A great title',
      body: 'This is the body',
      topic: 'banana',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no body', () => {
    const newArticle = {
      author: 'lurker',
      title: 'A great title',
      topic: 'cats',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no author', () => {
    const newArticle = {
      body: 'the body of the article',
      title: 'A great title',
      topic: 'cats',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no title', () => {
    const newArticle = {
      body: 'the body of the article',
      author: 'lurker',
      topic: 'cats',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('POST: 400 sends an appropriate status and error message when provided with an incomplete request - no topic', () => {
    const newArticle = {
      body: 'the body of the article',
      author: 'lurker',
      title: 'a thing about cats',
      article_img_url:
        'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
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
        expect(body.articles.length).toBe(10);
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
        expect(body.total_count).toEqual(0);
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

  test('DELETE: 204 deletes the specified article and sends no body back', () => {
    return request(app).delete('/api/articles/1').expect(204);
  });
  test('DELETE: 404 sends an appropriate status and error message when given a non-existent id', () => {
    return request(app)
      .delete('/api/articles/99999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('DELETE: 400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/articles/not-a-article')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
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
        expect(body.comments.length).toBe(10);
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
        expect(response.body.msg).toBe('bad request');
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
  test('GET: 200 sends an array comments limited to limit', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=6')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(6);
      });
  });

  test('GET: 400 bad request if limit is not a number', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('GET: 400 bad request if p is not a number', () => {
    return request(app)
      .get('/api/articles/1/comments?p=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('GET: 200 sends an array comments limited to limit and on page p', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=3&p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
      });
  });
  test('GET: 200 sends an array comments limited to limit and on page p - the last page has fewer results', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=3&p=4')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
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

describe('/api/users/:username', () => {
  test('GET: 200 user has the required properties', () => {
    return request(app)
      .get('/api/users/lurker')
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(users).toMatchObject({
          username: 'lurker',
          name: 'do_nothing',
          avatar_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        });
      });
  });
  test('GET: 404 sends an error when user does not exists', () => {
    return request(app)
      .get('/api/users/lurkering')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('user does not exist');
      });
  });
});

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

describe('/api/articles?limit=value&p=value', () => {
  test('GET: 200 sends an array articles limited to limit', () => {
    return request(app)
      .get('/api/articles?limit=6')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(6);
      });
  });

  test('GET: 400 bad request if limit is not a number', () => {
    return request(app)
      .get('/api/articles?limit=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('GET: 400 bad request if p is not a number', () => {
    return request(app)
      .get('/api/articles?p=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('GET: 200 sends an array articles limited to limit and on page p', () => {
    return request(app)
      .get('/api/articles?limit=3&p=4')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3);
      });
  });
  test('GET: 200 sends an array articles limited to limit and on page p - the last page has fewer results', () => {
    return request(app)
      .get('/api/articles?limit=3&p=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
      });
  });

  test('GET: 200 ALL the things', () => {
    return request(app)
      .get('/api/articles?topic=mitch&order=asc&sort_by=votes&limit=15&p=1')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('votes', {
          ascending: true,
        });
        expect(body.articles.length).toBe(12);
        expect(body.total_count).toBe(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch');
        });
      });
  });

  test('GET: 200 ALL the things with correct pagination', () => {
    return request(app)
      .get('/api/articles?topic=mitch&order=asc&sort_by=votes&limit=3&p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('votes', {
          ascending: true,
        });
        expect(body.articles.length).toBe(3);
        body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch');
        });
      });
  });
  test('GET: 200 ALL the things but topic has no things', () => {
    return request(app)
      .get('/api/articles?topic=paper&order=asc&sort_by=votes&limit=3&p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('votes', {
          ascending: true,
        });
        expect(body.articles.length).toBe(0);
        body.articles.forEach((article) => {});
      });
  });
  test('GET: 200 ALL the things with correct pagination - last page has fewer articles', () => {
    return request(app)
      .get('/api/articles?order=asc&sort_by=votes&limit=4&p=4')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('votes', {
          ascending: true,
        });
        expect(body.articles.length).toBe(1);
      });
  });
});

describe('/api/comments/:comment_id', () => {
  test('PATCH: 200 updates the requested comment by increasing votes', () => {
    const updateVotesBy = { inc_votes: 10 };
    return request(app)
      .patch('/api/comments/1')
      .send(updateVotesBy)
      .expect(200)
      .then((response) => {
        const updatedComment = response.body.updatedComment;
        expect(updatedComment.votes).toBe(26);
      });
  });
  test('PATCH: 200 updates the requested comment by decrementing votes, can go into negative numbers', () => {
    const updateVotesBy = { inc_votes: -100 };
    return request(app)
      .patch('/api/comments/1')
      .send(updateVotesBy)
      .expect(200)
      .then((response) => {
        const updatedComment = response.body.updatedComment;
        expect(updatedComment.votes).toBe(-84);
      });
  });
  test('PATCH: 200 sends the updated comment to the client', () => {
    const updateVotesBy = { inc_votes: 99 };
    return request(app)
      .patch('/api/comments/1')
      .send(updateVotesBy)
      .expect(200)
      .then((response) => {
        const expectedObject = {
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: 'butter_bridge',
          votes: 115,
          created_at: '2020-04-06T12:17:00.000Z',
        };
        expect(response.body.updatedComment).toEqual(expectedObject);
      });
  });
  test('PATCH: 404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    const updateVotesBy = { inc_votes: -200 };
    return request(app)
      .patch('/api/comments/999')
      .send(updateVotesBy)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('comment does not exist');
      });
  });
  test('PATCH: 400 sends an appropriate status and error message when given an invalid id', () => {
    const updateVotesBy = { inc_votes: -200 };
    return request(app)
      .patch('/api/comments/not-an-comment')
      .send(updateVotesBy)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test('PATCH: 400 sends an appropriate status and error message when given invalid input - in_votes not an integer', () => {
    const updateVotesBy = { inc_votes: 'banana' };
    return request(app)
      .patch('/api/comments/1')
      .send(updateVotesBy)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('invalid vote');
      });
  });
  test('DELETE: 204 deletes the specified comment and sends no body back', () => {
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
