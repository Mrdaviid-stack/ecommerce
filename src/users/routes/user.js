import { Router } from 'express'

import { AuthServices } from '../services/AuthServices'

const router = Router()
export const user = Router().use('/user', router)

router.get('/', async (request, response) => {
  try {
    response.send("Hello from User")
  } catch (error) {
    response.sendStatus(500)
  }
})
