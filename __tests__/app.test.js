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
  test('GET: 200 test data matches exactly', () => {
    const expected = [
      { slug: 'mitch', description: 'The man, the Mitch, the legend' },
      { slug: 'cats', description: 'Not dogs' },
      { slug: 'paper', description: 'what books are made of' },
    ];
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const topics = body;
        expect(topics).toEqual(expected);
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

describe('/api', () => {
  test('GET: 200 returns a JSON object', () => {
    return request(app).get('/api').expect(200).expect('Content-Type', /json/);
  });
  test('GET: 200 endpoints has the properties of the type required', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        const endpoints = body;
        expect(typeof endpoints).toBe('object');
        expect(endpoints).toHaveProperty('endpoints');
        for (const endpoint in body.endpoints) {
          const ep = body.endpoints[endpoint];
          expect(ep).toHaveProperty('description');
          expect(typeof ep.description).toBe('string');
          expect(ep).toHaveProperty('queries');
          expect(Array.isArray(ep.queries)).toBe(true);
          expect(ep).toHaveProperty('format');
          expect(typeof ep.format).toBe('string');
          expect(ep).toHaveProperty('exampleResponse');
          expect(typeof ep.exampleResponse).toBe('object');
        }
      });
  });
});
