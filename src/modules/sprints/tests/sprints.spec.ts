import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import createApp from '@/app'

const db = await createTestDatabase()
const app = createApp(db)

describe('Sprints API', () => {
  describe('POST /sprints', () => {
    it('should create a new sprint', async () => {
      const sprintData = {
        name: 'First Steps Into Programming with Python',
        code: 'WD-1.1',
      }

      const { body, status } = await supertest(app)
        .post('/sprints')
        .send(sprintData)

      expect(status).toBe(201)
      expect(body).toMatchObject({
        id: expect.any(Number),
        name: 'First Steps Into Programming with Python',
        code: 'WD-1.1',
      })
    })

    it('should return 400 when validation fails', async () => {
      const invalidData = {
        name: '',
        code: '',
      }

      const { body, status } = await supertest(app)
        .post('/sprints')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })

    it('should return 400 when name is missing', async () => {
      const invalidData = {}

      const { body, status } = await supertest(app)
        .post('/sprints')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })

    it('should return 400 when code is missing', async () => {
      const invalidData = { name: 'Sprint name' }

      const { body, status } = await supertest(app)
        .post('/sprints')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })

    it('should return 400 when name is not a string', async () => {
      const invalidData = { name: 123 }

      const { body, status } = await supertest(app)
        .post('/sprints')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })

    it('should return 400 when code is not a string', async () => {
      const invalidData = { name: 'Sprint name', code: 456 }

      const { body, status } = await supertest(app)
        .post('/sprints')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })
  })

  describe('GET /sprints', () => {
    it('should return all sprints', async () => {
      const { body, status } = await supertest(app).get('/sprints')

      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)

      if (body.length > 0) {
        expect(body[0]).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          code: expect.any(String),
        })
      }
    })
  })

  describe('GET /sprints/:id', () => {
    it('should return a sprint by its ID', async () => {
      const { body: createdSprint } = await supertest(app)
        .post('/sprints')
        .send({
          name: 'First Steps Into Programming with Python',
          code: 'WD-1.1',
        })

      const { body, status } = await supertest(app).get(
        `/sprints/${createdSprint.id}`
      )

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id: createdSprint.id,
        name: 'First Steps Into Programming with Python',
        code: 'WD-1.1',
      })
    })

    it('should return 404 if sprint not found', async () => {
      const { body, status } = await supertest(app).get('/sprints/999')

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })
  })

  describe('PATCH /sprints/:id', () => {
    it('should update a sprint by its ID', async () => {
      const { body: createdSprint } = await supertest(app)
        .post('/sprints')
        .send({
          name: 'First Steps Into Programming with Python',
          code: 'WD-1.1',
        })

      const updatedData = { name: 'Updated Name', code: 'WD-1.2' }
      const { body, status } = await supertest(app)
        .patch(`/sprints/${createdSprint.id}`)
        .send(updatedData)

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id: createdSprint.id,
        name: 'Updated Name',
        code: 'WD-1.2',
      })
    })

    it('should return 404 if sprint to update is not found', async () => {
      const updatedData = { name: 'Updated Name', code: 'WD-1.2' }
      const { body, status } = await supertest(app)
        .patch('/sprints/999')
        .send(updatedData)

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })
  })

  describe('DELETE /sprints/:id', () => {
    it('should delete a sprint by its ID', async () => {
      const { body: createdSprint } = await supertest(app)
        .post('/sprints')
        .send({ name: 'To be deleted', code: 'WD-1.3' })

      const { body, status } = await supertest(app).delete(
        `/sprints/${createdSprint.id}`
      )

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id: createdSprint.id,
        name: 'To be deleted',
        code: 'WD-1.3',
      })
    })

    it('should return 404 if sprint to delete is not found', async () => {
      const { body, status } = await supertest(app).delete('/sprints/999')

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })
  })
})
