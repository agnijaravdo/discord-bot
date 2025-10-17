import 'dotenv/config'
import { type Kysely, type MigrationProvider, Migrator } from 'kysely'
import type { DB } from '../types'

export async function migrateToLatest(
  provider: MigrationProvider,
  db: Kysely<DB>
) {
  const migrator = new Migrator({
    db,
    provider,
  })

  return migrator.migrateToLatest()
}
