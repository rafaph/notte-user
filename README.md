# notte-user

## User management

- Create, update, and delete a logged User.
- Login.

## Dev

1. Clone [notte-dev](https://github.com/rafaph/notte-dev).
2. Bootstrap environment
   ```
   cd notte-dev
   make init
   ```
3. Use the `Makefile`
   ```
   cd services/user
   make shell
   npm run test:cov
   npm run start:dev
   # see the package.json file to find out more scripts.
   ```
