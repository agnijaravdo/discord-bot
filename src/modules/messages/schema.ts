import { z } from 'zod'
import type { Messages as Message } from '@/database/types'

type Record = Message
const schema = z.object({
  id: z.coerce.number().int().positive(),
  username: z.string().min(1).max(50).trim(),
  sprintId: z.coerce.number().int().positive(),
  templateId: z.coerce.number().int().positive(),
  finalMessage: z.string().min(1).max(2000),
  gifUrl: z.string().min(1),
  sentAt: z.string(),
})

const postPayload = z.object({
  username: z.string().min(1).max(50).trim(),
  sprintCode: z.string().min(1).max(20).trim(),
})

const queryParams = z.object({
  username: z.string().min(1).max(50).trim().optional(),
  sprint: z.string().min(1).max(20).trim().optional(),
})

const insertable = schema.omit({
  id: true,
  sentAt: true,
})

export const parse = (record: unknown) => schema.parse(record)
export const parsePostPayload = (payload: unknown) => postPayload.parse(payload)
export const parseQueryParams = (query: unknown) => queryParams.parse(query)
export const parseInsertable = (record: unknown) => insertable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
