import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'
import { createFor } from '@tests/utils/records'
import type { Database } from '@/database'

describe('Messages Repository', () => {
  let db: Database
  let repository: ReturnType<typeof buildRepository>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createMessages: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createSprints: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createTemplates: any

  beforeEach(async () => {
    db = await createTestDatabase()
    repository = buildRepository(db)
    createMessages = createFor(db, 'messages')
    createSprints = createFor(db, 'sprints')
    createTemplates = createFor(db, 'templates')

    await createSprints([
      { id: 1, name: 'Sprint 1', code: 'WD-1.1' },
      { id: 2, name: 'Sprint 2', code: 'WD-1.2' },
    ])

    await createTemplates([
      { id: 1, message: 'Congratulations!' },
      { id: 2, message: 'Well done!' },
    ])

    await createMessages([
      {
        username: 'john_doe',
        sprintId: 1,
        templateId: 1,
        finalMessage: 'John has just completed the sprint!',
        gifUrl: 'https://example.com/gif.gif',
      },
      {
        username: 'jane_doe',
        sprintId: 2,
        templateId: 2,
        finalMessage: 'Jane has just completed the sprint!',
        gifUrl: 'https://example.com/gif.gif',
      },
    ])
  })

  afterEach(async () => {
    await db.destroy()
  })

  it('should return all existing messages', async () => {
    const messages = await repository.findAll()

    expect(messages).toHaveLength(2)
    expect(messages).toEqual([
      {
        id: expect.any(Number),
        username: 'john_doe',
        sprintId: 1,
        templateId: 1,
        finalMessage: 'John has just completed the sprint!',
        gifUrl: 'https://example.com/gif.gif',
        sentAt: expect.any(String),
      },
      {
        id: expect.any(Number),
        username: 'jane_doe',
        sprintId: 2,
        templateId: 2,
        finalMessage: 'Jane has just completed the sprint!',
        gifUrl: 'https://example.com/gif.gif',
        sentAt: expect.any(String),
      },
    ])
  })

  it('should return messages by username', async () => {
    const messages = await repository.findByUsername('john_doe')

    expect(messages).toHaveLength(1)
    expect(messages[0].username).toBe('john_doe')
  })

  it('should return messages by sprint ID', async () => {
    const messages = await repository.findBySprintId(2)

    expect(messages).toHaveLength(1)
    expect(messages[0].sprintId).toBe(2)
  })

  it('should create a new message', async () => {
    const newMessage = await repository.create({
      username: 'beyonce',
      sprintId: 1,
      templateId: 2,
      finalMessage: 'Beyonce has just completed the sprint!',
      gifUrl: 'https://example.com/gif.gif',
    })

    expect(newMessage).toEqual({
      id: expect.any(Number),
      username: 'beyonce',
      sprintId: 1,
      templateId: 2,
      finalMessage: 'Beyonce has just completed the sprint!',
      gifUrl: 'https://example.com/gif.gif',
      sentAt: expect.any(String),
    })

    const messagesInDb = await repository.findAll()
    expect(messagesInDb).toHaveLength(3)
    expect(messagesInDb).toContainEqual(newMessage)
  })
})
