import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import createApp from '@/app'
import { createFor } from '@tests/utils/records'
import { fetchRandomCelebrationGif } from '@/services/giphy/giphy'

vi.mock('@/services/giphy/giphy', () => ({
  fetchRandomCelebrationGif: vi.fn(),
}))

vi.mock('@/services/discord/discord', () => ({
  sendCongratulationMessage: vi.fn().mockResolvedValue(undefined),
}))

describe('Messages API', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let db: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let app: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createSprints: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createTemplates: any

  beforeEach(async () => {
    db = await createTestDatabase()
    app = createApp(db)
    createSprints = createFor(db, 'sprints')
    createTemplates = createFor(db, 'templates')
    await createSprints([
      { id: 1, name: 'Web Development Introduction', code: 'WD-1.1' },
    ])

    await createTemplates([{ id: 1, message: 'Congratulations!' }])

    vi.clearAllMocks()

    vi.mocked(fetchRandomCelebrationGif).mockResolvedValue(
      'https://example.com/celebration.gif'
    )
  })

  afterEach(async () => {
    await db.destroy()
  })

  describe('POST /messages', () => {
    it('should create a new message with a celebration GIF', async () => {
      const { body, status } = await supertest(app).post('/messages').send({
        username: 'john_doe',
        sprintCode: 'WD-1.1',
      })

      expect(status).toBe(201)
      expect(body).toMatchObject({
        id: expect.any(Number),
        username: 'john_doe',
        sprintId: 1,
        templateId: 1,
        finalMessage:
          '@john_doe has just completed the sprint Web Development Introduction! Congratulations!',
        gifUrl: 'https://example.com/celebration.gif',
        sentAt: expect.any(String),
      })
      expect(fetchRandomCelebrationGif).toHaveBeenCalledTimes(1)
    })

    it('should call Giphy API for each message creation', async () => {
      await supertest(app).post('/messages').send({
        username: 'john_doe',
        sprintCode: 'WD-1.1',
      })

      await supertest(app).post('/messages').send({
        username: 'jane_doe',
        sprintCode: 'WD-1.1',
      })

      expect(fetchRandomCelebrationGif).toHaveBeenCalledTimes(2)
    })

    it('should return 404 if sprint not found', async () => {
      const { body, status } = await supertest(app).post('/messages').send({
        username: 'john_doe',
        sprintCode: 'none',
      })

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })

    it('should return 404 if no templates available', async () => {
      await db.deleteFrom('templates').execute()

      const { body, status } = await supertest(app).post('/messages').send({
        username: 'john_doe',
        sprintCode: 'WD-1.1',
      })

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })

    it('should return 400 when validation fails', async () => {
      const invalidData = {
        username: '',
        sprintCode: '',
      }

      const { body, status } = await supertest(app)
        .post('/messages')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })
  })

  describe('GET /messages', () => {
    it('should return all messages', async () => {
      const { body, status } = await supertest(app).get('/messages')

      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)

      if (body.length > 0) {
        expect(body[0]).toMatchObject({
          id: expect.any(Number),
          username: expect.any(String),
          sprintId: expect.any(Number),
          templateId: expect.any(Number),
          finalMessage: expect.any(String),
          gifUrl: expect.any(String),
          sentAt: expect.any(String),
        })
      }
    })

    it('should return messages by username', async () => {
      const { body, status } = await supertest(app).get(
        '/messages?username=john_doe'
      )

      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)

      body.forEach((message: { username: string }) => {
        expect(message.username).toBe('john_doe')
      })
    })

    it('should return 200 and empty array if no messages for username', async () => {
      const { body, status } = await supertest(app).get(
        '/messages?username=non_existent_user'
      )

      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.length).toBe(0)
    })

    it('should return 404 if sprint code not found', async () => {
      const { body, status } = await supertest(app).get('/messages?sprint=123')

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })
  })
})
