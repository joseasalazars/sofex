# Sofex Challenge

## Features

- Import a HTML file and watch it magically convert to Markdown
- Drag and drop images (requires your Dropbox account be linked)
- Import and save files from GitHub, Dropbox, Google Drive and One Drive
- Drag and drop markdown and HTML files into Dillinger
- Export documents as Markdown, HTML and PDF

## Tech

Sofex uses a number of open source projects to work properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [Typescript] - programming language that builds on JavaScript
- [PostgreSQL] - a powerful object-relational database
- [Objection.js] - is an ORM for node.js
- [Knex.js] - SQL query builder for PostgreSQL

## Installation

Sofex requires [Node.js](https://nodejs.org/) and PostgreSQL to run.

```
brew install node && brew install postgresql
brew services start postgresql
```

Start PostgreSQL and create dev DB.

```
sudo -u postgres psql
create database sofexdb
```

Install the dependencies.

```
cd sofex
npm i
```

Run migrations on DB and start server.

```
knex migrate:latest --migrations-directory ./migrations --knexfile ./src/db/knexfile.js
npm run start
```

### [API Calls Examples](https://documenter.getpostman.com/view/3376676/2s8YevpAbq)

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen."
[node.js]: http://nodejs.org
[express]: http://expressjs.com
[postgresql]: https://www.postgresql.org/
[typescript]: https://www.typescriptlang.org/
[objection.js]: https://vincit.github.io/objection.js/
[knex.js]: https://knexjs.org/
