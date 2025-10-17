import { Router } from 'express'
import * as schema from './schema'
import type { Database } from '@/database'
import { jsonRoute, unsupportedRoute } from '@/utils/middleware'
import buildRepository from './repository'
import { StatusCodes } from 'http-status-codes'
import { TemplateNotFound } from './errors'

export default (db: Database) => {
  const templates = buildRepository(db)
  const router = Router()

  router
    .route('/')
    .get(
      jsonRoute(async () => {
        return templates.findAll()
      }, StatusCodes.OK)
    )
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return templates.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const template = await templates.findById(id)

        if (!template) {
          throw new TemplateNotFound()
        }

        return template
      }, StatusCodes.OK)
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const updated = await templates.updateById(id, bodyPatch)

        if (!updated) {
          throw new TemplateNotFound()
        }

        return updated
      }, StatusCodes.OK)
    )
    .put(unsupportedRoute)
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const deleted = await templates.deleteById(id)

        if (!deleted) {
          throw new TemplateNotFound()
        }

        return deleted
      }, StatusCodes.OK)
    )

  return router
}
