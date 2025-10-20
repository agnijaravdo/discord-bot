import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  finalMessage: string
  gifUrl: string
  id: Generated<number>
  sentAt: Generated<string>
  sprintId: number
  templateId: number
  username: string
}

export interface Sprints {
  code: string
  id: Generated<number>
  name: string
}

export interface Templates {
  id: Generated<number>
  message: string
}

export interface DB {
  messages: Messages
  sprints: Sprints
  templates: Templates
}
