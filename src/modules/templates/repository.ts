import type { Insertable, Selectable, Updateable } from 'kysely'
import { keys } from './schema'
import type { Templates, Database } from '@/database'

const TABLE = 'templates'
type Row = Templates
type RowInsert = Insertable<Row>
type RowUpdate = Updateable<Row>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).selectAll().execute()
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  create(template: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(template)
      .returning(keys)
      .executeTakeFirst()
  },

  updateById(id: number, template: RowUpdate): Promise<RowSelect | undefined> {
    return db
      .updateTable(TABLE)
      .set(template)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },

  deleteById(id: number): Promise<RowSelect | undefined> {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
})
