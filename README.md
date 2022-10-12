# StoreFront Backend

> ## An API for an online storefront

## Getting started

To get API running locally:

### Initialize the Database

- Create 2 Databases with the following names:
    a) store
    b) store_test

### Get the code and run it

- Clone this repo
- `npm i` to install all required dependencies
- `npx db-migrate up` to migrate all the tables to your database
- `npm run start` to run the compiled code

## List of available commands

- `npm run build` to transpile the ts code into js
- `npm run lint` to lint the code
- `npm run lint:f` to fix the auto-fixable lint errors
- `npm run test` to run all the tests
- `npm run start` to run the compiled code
- `npm run dev` to run the ts modules using nodemon

## API endpoints and Database Schema
- Check [REQUIREMENTS.md](https://github.com/seifalaa/Storefront-Backend/blob/master/REQUIREMENTS.md)

## Built with

- [NodeJs](https://nodejs.org/en/) - Javascript Runtime
- [Express](https://expressjs.com/) - Web Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Postgres](https://www.postgresql.org/) - Database management system
