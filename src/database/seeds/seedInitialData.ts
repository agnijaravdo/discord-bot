import { SqliteDialect, Kysely } from 'kysely'
import type { DB } from '../types'
import SQLite from 'better-sqlite3'
import 'dotenv/config'

async function seedInitialData(db: Kysely<DB>) {
  await db
    .insertInto('templates')
    .values([
      { message: 'You nailed it! 💪' },
      { message: 'You did it! I knew you could. 🤗' },
      { message: 'Way to go! 🎉' },
      { message: 'Congratulations! You did it!' },
      { message: `Oh my gosh, that's excellent! 🤩` },
      { message: 'Woo-hoo!! You are amazing! 🚀' },
    ])
    .execute()

  await db
    .insertInto('sprints')
    .values([
      { code: 'WD-1.1', name: 'First Steps Into Programming with Python' },
      { code: 'WD-1.2', name: 'Intermediate Programming with Python' },
      { code: 'WD-1.3', name: 'Object Oriented Programming' },
      { code: 'WD-1.4', name: 'Computer Science Fundamentals' },
      { code: 'WD-2.1', name: 'HTML and CSS - the Foundation of Web Pages' },
    ])
    .execute()
}
async function runSeed() {
  const db = new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite(process.env.DATABASE_URL),
    }),
  })

  try {
    await seedInitialData(db)
    console.log('Seeding complete!')
  } catch (err) {
    console.error('Seeding failed:', err)
  } finally {
    await db.destroy()
  }
}

runSeed()
