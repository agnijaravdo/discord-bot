import { Router } from 'express'
import type { Database } from '@/database'
import * as schema from './schema'
import { jsonRoute } from '@/utils/middleware'
import buildRepository from './repository'
import buildSprintsRepository from '../sprints/repository'
import buildTemplatesRepository from '../templates/repository'
import { StatusCodes } from 'http-status-codes'
import { SprintNotFound } from '../sprints/errors'
import { TemplateNotFound } from '../templates/errors'

export default (db: Database) => {
  const messages = buildRepository(db)
  const sprints = buildSprintsRepository(db)
  const templates = buildTemplatesRepository(db)
  const router = Router()

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const { username, sprint } = schema.parseQueryParams(req.query) // GET /messages?username=$name and GET /messages?sprint=$code

        if (username) {
          return await messages.findByUsername(username)
        }
        if (sprint) {
          return await messages.findBySprintCode(sprint)
        }

        return await messages.findAll() // GET /messages
      }, StatusCodes.OK)
    )
    .post(
      jsonRoute(async (req) => {
        const { username, sprintCode } = schema.parsePostPayload(req.body)

        const sprint = await sprints.findByCode(sprintCode)
        if (!sprint) {
          throw new SprintNotFound(`Sprint with code ${sprintCode} not found`)
        }

        const allTemplates = await templates.findAll()
        if (allTemplates.length === 0) {
          throw new TemplateNotFound('No templates available')
        }
        const randomTemplate =
          allTemplates[Math.floor(Math.random() * allTemplates.length)]

        const messageData = {
          username,
          sprintId: sprint.id,
          templateId: randomTemplate.id,
          finalMessage: `${username} has just completed the sprint ${sprint.name}! ${randomTemplate.message}`,
          gifUrl: 'https://example.com/default.gif',
        }

        const validatedMessageData = schema.parseInsertable(messageData)
        return await messages.create(validatedMessageData)
      }, StatusCodes.CREATED)
    )

  return router
}
