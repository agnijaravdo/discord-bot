# Discord Achievement Bot

Discord bot that cheers users on for their learning achievements, helping foster a supportive and motivating community.

## Features

- REST API to send and manage congratulatory messages for learning achievements
- Integrates with Discord to send celebratory messages and GIFs about user's achievements to selected channels
- Fetches random celebration GIFs from Giphy
- Retrieves random congratulatory message templates from the database
- Retrieves sprint titles from the database
- Stores sent messages and metadata for later retrieval

## API Endpoints

- `POST /messages` — Send a congratulatory message to a user on Discord
- `GET /messages` — List all congratulatory messages
- `GET /messages?username=johdoe` — List messages for a specific user
- `GET /messages?sprint=WD-1.1` — List messages for a specific sprint
- `POST/GET/PATCH/DELETE /templates` — Manage congratulatory message templates
- `POST/GET/PATCH/DELETE /sprints` — Manage sprints

## Technologies Used

- Node.js & TypeScript
- Express.js (REST API)
- SQLite (database)
- Kysely (type-safe SQL queries & migrations)
- Zod (validation)
- Discord.js (Discord bot integration)
- @giphy/js-fetch-api (GIFs from Giphy)
- Vitest (testing)
- ESLint & Prettier (linting & formatting)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Copy environment file:**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and add your Discord, Giphy, and database values.

3. **Run migrations to create tables:**

   ```bash
   npm run migrate:latest
   ```

4. **Generate TypeScript types:**

   ```bash
   npm run gen:types
   ```

5. **Seed initial sprints and templates:**
   ```bash
   npm run seed
   ```

## Running and Testing

- **Run in development mode:**

  ```bash
  npm run dev
  ```

- **Run in production mode:**

  ```bash
  npm run start
  ```

- **Run tests:**

  ```bash
  npm test
  ```

- **Run coverage:**
  ```bash
  npm run coverage
  ```
