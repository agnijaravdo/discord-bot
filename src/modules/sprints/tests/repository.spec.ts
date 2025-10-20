import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'
import { createFor } from '@tests/utils/records'
import type { Database } from '@/database'

describe('Sprints Repository', () => {
  let db: Database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let repository: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createSprints: any

  beforeEach(async () => {
    db = await createTestDatabase()
    repository = buildRepository(db)
    createSprints = createFor(db, 'sprints')
  })

  afterEach(async () => {
    await db.destroy()
  })

  it('should return existing sprint', async () => {
    await createSprints([
      {
        name: 'First Steps Into Programming with Python',
        code: 'WD-1.1',
      },
    ])

    const sprints = await repository.findAll()

    expect(sprints).toEqual([
      {
        id: expect.any(Number),
        name: 'First Steps Into Programming with Python',
        code: 'WD-1.1',
      },
    ])
  })

  it('should return a sprint by its ID', async () => {
    await createSprints([
      {
        id: 11,
        name: 'First Steps Into Programming with Python',
        code: 'WD-1.1',
      },
      {
        id: 12,
        name: 'Introduction to Web Development',
        code: 'WD-1.2',
      },
      {
        id: 13,
        name: 'Data Structures and Algorithms',
        code: 'WD-1.3',
      },
    ])

    const sprint = await repository.findById(12)

    expect(sprint).toEqual({
      id: 12,
      name: 'Introduction to Web Development',
      code: 'WD-1.2',
    })
  })

  it('should return a sprint by its code', async () => {
    await createSprints([
      {
        id: 21,
        name: 'First Steps Into Programming with Python',
        code: 'WD-1.1',
      },
      {
        id: 22,
        name: 'Introduction to Web Development',
        code: 'WD-1.2',
      },
    ])

    const sprint = await repository.findByCode('WD-1.2')

    expect(sprint).toEqual({
      id: 22,
      name: 'Introduction to Web Development',
      code: 'WD-1.2',
    })
  })

  it('should create a new sprint', async () => {
    const newSprint = await repository.create({
      name: 'First Steps Into Programming with Python',
      code: 'WD-1.1',
    })

    expect(newSprint).toEqual({
      id: expect.any(Number),
      name: 'First Steps Into Programming with Python',
      code: 'WD-1.1',
    })

    const sprintsInDb = await repository.findAll()
    expect(sprintsInDb).toContainEqual(newSprint)
  })

  it('should update a sprint by its ID', async () => {
    await createSprints([
      {
        id: 31,
        name: 'Old Name',
        code: 'WD-1.1',
      },
    ])

    const updatedSprint = await repository.updateById(31, {
      name: 'New Name',
      code: 'WD-1.2',
    })

    expect(updatedSprint).toEqual({
      id: 31,
      name: 'New Name',
      code: 'WD-1.2',
    })

    const sprintsInDb = await repository.findAll()
    expect(sprintsInDb).toContainEqual(updatedSprint)
  })

  it('should delete a sprint by its ID', async () => {
    await createSprints([
      {
        id: 41,
        name: 'Sprint to be deleted',
        code: 'WD-1.3',
      },
    ])

    const deletedSprint = await repository.deleteById(41)
    expect(deletedSprint).toEqual({
      id: 41,
      name: 'Sprint to be deleted',
      code: 'WD-1.3',
    })
    const sprintsInDb = await repository.findAll()
    expect(sprintsInDb).not.toContainEqual(deletedSprint)
  })
})
