import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('sprints')
    .addColumn('code', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createIndex('idx_sprints_code')
    .on('sprints')
    .column('code')
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropIndex('idx_sprints_code').execute()
  await db.schema.alterTable('sprints').dropColumn('code').execute()
}
