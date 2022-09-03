import { createServer } from 'http'
import express from 'express'
import helmet from 'helmet'
import cookie from 'cookie-parser'
import 'dotenv/config'

import { apiRouter } from './router'

import { cors } from '../middlewares/Cors'
import { logger } from '../middlewares/Logger'

const app = express()
const server = createServer(app)

app.use(helmet())
app.use(cors)
app.use(logger)
app.use(express.json())
app.use(cookie())

app.use('/', apiRouter)

export const ApiServer = (port) => {
  server.listen(port || 80, () => console.log(port))
}
