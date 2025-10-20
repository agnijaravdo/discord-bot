import { z } from 'zod'
import type { Sprints as Sprint } from '@/database'

type Record = Sprint
const schema = z.object({
  id: z.coerce.number().int().positive(),
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .min(1, { message: 'Name must be at least 1 character long' })
    .max(100, { message: 'Name must be maximum 100 characters long' })
    .trim(),
})

const insertable = schema.omit({
  id: true,
})

const updateable = insertable.partial()

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdateable = (record: unknown) => updateable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
