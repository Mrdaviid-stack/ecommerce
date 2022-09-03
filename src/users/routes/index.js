import { Router } from 'express'

import { user } from './user'

export const authRouter = Router()
  .use(user)