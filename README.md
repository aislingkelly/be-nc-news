# New New News

## About The Project

This app provides an API that serves as a backend service. It in similar to a real-world application such as Reddit. The aim is to facilitate programmatic access to application data, providing a backend solution for front-end architectures.

### Core Functionalities

The API provides a range of endpoints, each catering to specific data needs. A complete list of endpoints and example output is available at /api.

1. **GET /api:** Lists all available endpoints.
2. **GET /api/topics:** Returns a list of topics.
3. **GET /api/articles/:article_id:** Returns a specific article using its `article_id`.
4. **GET /api/articles:** Returns a list of articles.
5. **GET /api/articles/:article_id/comments:** Returns comments associated with a specific `article_id`.
6. **POST /api/articles/:article_id/comments:** Allows adding a comment to an article identified by `article_id`.
7. **PATCH /api/articles/:article_id:** Updates an article specified by `article_id`.
8. **DELETE /api/comments/:comment_id:** Deletes a comment using its `comment_id`.
9. **GET /api/users:** Returns all users.
10. **GET /api/articles (queries):** Supports filtering and sorting of articles.
11. **GET /api/articles/:article_id (comment count):** Returns a single article along with its comment count.

## Project Setup Instructions

To get started with this project, you need to configure your environment for both testing, development and deployment.

### Step 1: Create Environment Files

Begin by creating three files at the root of your project:

- `.env.test`
- `.env.development`
- `.env.production`

### Step 2: Configure Environment Files

Next, configure each of the environment files:

- For `.env.test`: Add the line `PGDATABASE=<database_name>`, replacing `<database_name>` with the name of your test database. The database names can be found in the `/db/setup.sql` file.
- For `.env.development`: Follow the same procedure as above, but use the development database name instead.
- For `.env.production`: Set the DATABASE_URL with the URL of your hosted database.

This configuration ensures that your application connects to the correct database depending on the environment it is running in.
