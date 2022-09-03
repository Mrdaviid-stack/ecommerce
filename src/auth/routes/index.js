import { Router } from 'express'
import { auth } from './auth'

export const authRouter = Router()
  .use(auth)