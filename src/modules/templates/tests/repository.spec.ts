import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'
import { createFor } from '@tests/utils/records'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createTemplates = createFor(db, 'templates')

describe('Templates Repository', () => {
  it('should return existing templates', async () => {
    await createTemplates([
      {
        message: 'Congratulations! You did it!',
      },
    ])

    const templates = await repository.findAll()

    expect(templates).toEqual([
      {
        id: expect.any(Number),
        message: 'Congratulations! You did it!',
      },
    ])
  })

  it('should return a template by its ID', async () => {
    await createTemplates([
      {
        id: 11,
        message: 'Template 1',
      },
      {
        id: 12,
        message: 'Template 2',
      },
      {
        id: 13,
        message: 'Template 3',
      },
    ])

    const template = await repository.findById(12)

    expect(template).toEqual({
      id: 12,
      message: 'Template 2',
    })
  })

  it('should create a new template', async () => {
    const newTemplate = await repository.create({
      message: 'Congratulations! You did it!',
    })

    expect(newTemplate).toEqual({
      id: expect.any(Number),
      message: 'Congratulations! You did it!',
    })

    const templatesInDb = await repository.findAll()
    expect(templatesInDb).toContainEqual(newTemplate)
  })

  it('should update a template by its ID', async () => {
    await createTemplates([
      {
        id: 21,
        message: 'Old Message',
      },
    ])

    const updatedTemplate = await repository.updateById(21, {
      message: 'New Message',
    })

    expect(updatedTemplate).toEqual({
      id: 21,
      message: 'New Message',
    })

    const templatesInDb = await repository.findAll()
    expect(templatesInDb).toContainEqual(updatedTemplate)
  })

  it('should delete a template by its ID', async () => {
    await createTemplates([
      {
        id: 32,
        message: 'Template to be deleted',
      },
    ])

    const deletedTemplate = await repository.deleteById(32)
    expect(deletedTemplate).toEqual({
      id: 32,
      message: 'Template to be deleted',
    })
    const templatesInDb = await repository.findAll()
    expect(templatesInDb).not.toContainEqual(deletedTemplate)
  })
})
