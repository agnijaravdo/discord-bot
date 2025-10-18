import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import createApp from '@/app'

const db = await createTestDatabase()
const app = createApp(db)

describe('Templates API', () => {
  describe('POST /templates', () => {
    it('should create a new template', async () => {
      const templateData = {
        message: 'Congratulations! You did it!',
      }

      const { body, status } = await supertest(app)
        .post('/templates')
        .send(templateData)

      expect(status).toBe(201)
      expect(body).toMatchObject({
        id: expect.any(Number),
        message: 'Congratulations! You did it!',
      })
    })

    it('should return 400 when validation fails', async () => {
      const invalidData = {
        message: '',
      }

      const { body, status } = await supertest(app)
        .post('/templates')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })

    it('should return 400 when message is missing', async () => {
      const invalidData = {}

      const { body, status } = await supertest(app)
        .post('/templates')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })

    it('should return 400 when message is not a string', async () => {
      const invalidData = { message: 123 }

      const { body, status } = await supertest(app)
        .post('/templates')
        .send(invalidData)

      expect(status).toBe(400)
      expect(body.error).toBeDefined()
    })
  })

  describe('GET /templates', () => {
    it('should return all templates', async () => {
      const { body, status } = await supertest(app).get('/templates')

      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)

      if (body.length > 0) {
        expect(body[0]).toMatchObject({
          id: expect.any(Number),
          message: expect.any(String),
        })
      }
    })
  })

  describe('GET /templates/:id', () => {
    it('should return a template by its ID', async () => {
      const { body: createdTemplate } = await supertest(app)
        .post('/templates')
        .send({ message: 'Congratulations! You did it!' })

      const { body, status } = await supertest(app).get(
        `/templates/${createdTemplate.id}`
      )

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id: createdTemplate.id,
        message: 'Congratulations! You did it!',
      })
    })

    it('should return 404 if template not found', async () => {
      const { body, status } = await supertest(app).get('/templates/999')

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })
  })

  describe('PATCH /templates/:id', () => {
    it('should update a template by its ID', async () => {
      const { body: createdTemplate } = await supertest(app)
        .post('/templates')
        .send({ message: 'Old Message' })

      const updatedData = { message: 'Updated Message' }
      const { body, status } = await supertest(app)
        .patch(`/templates/${createdTemplate.id}`)
        .send(updatedData)

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id: createdTemplate.id,
        message: 'Updated Message',
      })
    })

    it('should return 404 if template to update is not found', async () => {
      const updatedData = { message: 'Updated Message' }
      const { body, status } = await supertest(app)
        .patch('/templates/999')
        .send(updatedData)

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })
  })

  describe('DELETE /templates/:id', () => {
    it('should delete a template by its ID', async () => {
      const { body: createdTemplate } = await supertest(app)
        .post('/templates')
        .send({ message: 'To be deleted' })

      const { body, status } = await supertest(app).delete(
        `/templates/${createdTemplate.id}`
      )

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id: createdTemplate.id,
        message: 'To be deleted',
      })
    })

    it('should return 404 if template to delete is not found', async () => {
      const { body, status } = await supertest(app).delete('/templates/999')

      expect(status).toBe(404)
      expect(body.error).toBeDefined()
    })
  })
})
