# BE NC News API Project Setup Instructions

For this project, you'll need to set up two environment files to manage your database connections in different environments: testing and development.

1. Create two files in the root of your project:

   - `.env.test`
   - `.env.development`

2. Open each file and add the following line, replacing `<database_name>` with the appropriate database name for each environment. You can find the database names in the `/db/setup.sql` file.

   - In `.env.test`: PGDATABASE=<database_name>

   - In `.env.development`: PGDATABASE=<database_name>
