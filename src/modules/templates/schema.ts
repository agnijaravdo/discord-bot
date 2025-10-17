import { z } from 'zod'
import type { Templates as Template } from '@/database'

type Record = Template
const schema = z.object({
  id: z.coerce.number().int().positive(),
  message: z
    .string({ invalid_type_error: 'Message must be a string' })
    .min(1, { message: 'Message must be at least 1 character long' })
    .max(1000, { message: 'Message must be maximum 1000 characters long' })
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
