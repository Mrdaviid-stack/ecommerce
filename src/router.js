import { Router } from 'express'

import { authRouter } from '../src/auth/routes'

const moduleRouters = [
  authRouter
]

export const apiRouter = Router()
for (const moduleRouter of moduleRouters)
  apiRouter.use('/', moduleRouter)
