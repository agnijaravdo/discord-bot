import { Router } from 'express'
import * as schema from './schema'
import type { Database } from '@/database'
import { jsonRoute, unsupportedRoute } from '@/utils/middleware'
import buildRepository from './repository'
import { StatusCodes } from 'http-status-codes'
import { SprintNotFound } from './errors'

export default (db: Database) => {
  const sprints = buildRepository(db)
  const router = Router()

  router
    .route('/')
    .get(
      jsonRoute(async () => {
        return sprints.findAll()
      }, StatusCodes.OK)
    )
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return sprints.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const sprint = await sprints.findById(id)

        if (!sprint) {
          throw new SprintNotFound()
        }

        return sprint
      }, StatusCodes.OK)
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const updated = await sprints.updateById(id, bodyPatch)

        if (!updated) {
          throw new SprintNotFound()
        }

        return updated
      }, StatusCodes.OK)
    )
    .put(unsupportedRoute)
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const deleted = await sprints.deleteById(id)

        if (!deleted) {
          throw new SprintNotFound()
        }

        return deleted
      }, StatusCodes.OK)
    )

  return router
}
