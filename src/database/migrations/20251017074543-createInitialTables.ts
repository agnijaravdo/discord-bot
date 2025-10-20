import { Kysely, sql, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('message', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('name', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('username', 'text', (c) => c.notNull())
    .addColumn('sprint_id', 'integer', (c) =>
      c.notNull().references('sprints.id').onDelete('cascade')
    )
    .addColumn('template_id', 'integer', (c) =>
      c.notNull().references('templates.id').onDelete('cascade')
    )
    .addColumn('final_message', 'text', (c) => c.notNull())
    .addColumn('gif_url', 'text', (c) => c.notNull())
    .addColumn('sent_at', 'text', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('messages').ifExists().execute()
  await db.schema.dropTable('sprints').ifExists().execute()
  await db.schema.dropTable('templates').ifExists().execute()
}
