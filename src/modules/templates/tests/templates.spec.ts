import supertest from 'supertest'
import createDatabase from '@/database'
import createApp from '@/app'

const db = createDatabase(process.env.DATABASE_URL as string, {
  readonly: true,
})
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
})

//   describe('GET /screenings', () => {
//     it('should return all screenings with movie details', async () => {
//       // Act
//       const { body, status } = await supertest(app).get('/screenings')

//       // Assert
//       expect(status).toBe(200)
//       expect(Array.isArray(body)).toBe(true)

//       if (body.length > 0) {
//         expect(body[0]).toMatchObject({
//           id: expect.any(Number),
//           movie: {
//             id: expect.any(Number),
//             title: expect.any(String),
//             year: expect.any(Number),
//           },
//           timestamp: expect.any(String),
//           totalTickets: expect.any(Number),
//           reservedTickets: expect.any(Number),
//           ticketsLeft: expect.any(Number),
//         })
//       }
//     })
//   })
