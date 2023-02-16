# BLINKER - Link saver and blog scraper

This repository contains the source code for the Blinker project. It allows you to save links, scrapes blogs for new posts and shortens the links.
It is written in TypeScript, using Express, PostgreSQL and Redis (on Docker containers).

This API is hosted on DigitalOcean and can be accessed at:

- [API DOCUMENTATION](https://gm3.tech/blinker/api-docs/)
- [FRONTEND APP](https://blinker.gm3.tech)
- [FRONTEND REPOSITORY](https://github.com/GessioMori/blinker-app)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Server setup](#server-setup)
  - [Docker setup](#docker-setup)
  - [Database setup](#database-setup)
- [Usage](#usage)
- [Testing](#testing)
  - [E2E tests](#e2e-tests)
- [CI/CD](#cicd)

## Features

- [x] Save links;
- [x] Scrapes blogs for new posts;
- [x] Authentication;
- [x] Authorization;
- [x] Rate limiting (Redis);
- [x] API documentation (Swagger);
- [x] E2E tests (Jest);
- [x] Unit tests (Jest);
- [x] Data validation (Zod);
- [x] CI/CD;
- [x] Docker;
- [x] Prisma;
- [x] Redis;
- [x] PostgreSQL;
- [x] Express;
- [x] TypeScript;
- [x] ESLint;
- [ ] Pagination;
- [ ] Sorting;
- [ ] Filtering;
- [ ] Search;

## Installation

### Requirements

- Node.js (v16.19.0);
- pnpm (v6.23.0);
- Docker (v20.10.8);

### Server setup

Clone the repository and install the dependencies:

```bash
git clone
cd blinker-api
pnpm install
```

Copy the `.env.example` file to `.env` and fill in the environment variables:

```bash
cp .env.example .env
```

### Docker setup

Start the PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

### Database setup

Create the database and run the migrations:

```bash
pnpm exec prisma migrate dev --name init
```

## Usage

Start the server in development mode:

```bash
pnpm dev
```

## Testing

Run the tests:

```bash
pnpm test
```

### E2E tests

There is a docker container with the database for the E2E tests. To start it, run:

First, you need to apply the migrations to the test database:

```bash
pnpm exec prisma migrate dev --name init --preview-feature --schema ./prisma/schema.test.prisma
```

Make sure the prisma.test.prisma file is pointing to the correct database:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_TEST")
}
```

## CI/CD

The CI/CD is done with GitHub Actions. The workflow is defined in the `.github/workflows` folder.
