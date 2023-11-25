# New New News

## About The Project

This app provides an API that serves as a backend service. It in similar to a real-world application such as Reddit. The aim is to facilitate programmatic access to application data, providing a backend solution for front-end architectures.

## API Endpoints

### General Endpoints

- **GET /api**: Provides a comprehensive list of all available endpoints, their descriptions, and query options.
- **GET /api/topics**: Retrieves an array of discussion topics.
- **GET /api/articles**: Fetches a collection of articles with optional filtering and sorting capabilities.
- **GET /api/users**: Retrieves an array of all registered users.

### Article Endpoints

- **GET /api/articles/:id**: Retrieves details of a specific article by its unique ID, including comments.
- **GET /api/articles/:article_id/comments**: Retrieves comments for a specific article, with pagination.
- **POST /api/articles**: Adds a new article to the database.
- **POST /api/articles/:article_id/comments**: Adds a new comment to a specified article.
- **PATCH /api/articles/:article_id**: Updates the vote count of a specific article.
- **DELETE /api/articles/:article_id**: Deletes an article and its respective comments.

### User Endpoints

- **GET /api/users/:username**: Retrieves details of a specific user by their username.

### Topic Endpoints

- **POST /api/topics**: Adds a new discussion topic.

### Comment Endpoints

- **PATCH /api/comments/:comment_id**: Updates the vote count of a specific comment.
- **DELETE /api/comments/:comment_id**: Deletes a specific comment.

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

### Installation and Setup

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/aislingkelly/new-new-news.git
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd new-new-news
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```

### Setting Up the Database

- To set up the databases, run:
  ```bash
  npm run setup-dbs
  ```

### Running the Development Server

- Start the development server using:
  ```bash
  npm start
  ```

## Testing

The application uses Jest and Supertest for testing.

- **Running Tests:**
  To run the tests, execute:
  ```bash
  npm test
  ```

## Scripts

- `setup-dbs`: Sets up the databases using `psql`.
- `seed`: Seeds the database with data.
- `test`: Runs tests using Jest.
- `prepare`: Installs Husky for Git hooks.
- `playground`: Executes a SQL file and outputs to `play.txt`.
- `start`: Starts the Node.js server.
- `seed-prod`: Seeds the database in a production environment.

## Development

### Dev Dependencies

- Husky (^8.0.2)
- Jest (^27.5.1) with extensions (jest-extended, jest-sorted)
- pg-format (^1.0.4)
- supertest (^6.3.3)

### Main Dependencies

- dotenv (^16.0.0)
- express (^4.18.2)
- pg (^8.7.3)
