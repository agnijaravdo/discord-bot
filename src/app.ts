import express from 'express'
import jsonErrorHandler from './middleware/jsonErrors'
import { type Database } from './database'
import templates from './modules/templates/controller'

export default function createApp(db: Database) {
  const app = express()

  app.use(express.json())

  app.use('/templates', templates(db))

  app.use(jsonErrorHandler)

  return app
}
