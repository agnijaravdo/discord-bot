import type { Insertable, Selectable } from 'kysely'
import { keys } from './schema'
import type { Database, Messages } from '@/database'

const TABLE = 'messages'
type Row = Messages
type RowInsert = Insertable<Row>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).selectAll().execute()
  },

  findByUsername(username: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('username', '=', username)
      .execute()
  },

  findBySprintId(sprintId: number): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('sprintId', '=', sprintId)
      .execute()
  },

  create(message: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(message)
      .returning(keys)
      .executeTakeFirst()
  },
})
