import { Router } from 'express'
import { AuthRules, Validate } from '../validators/AuthValidator'

import { verifyToken } from '../../../middlewares/Verify-Token'

import { AuthServices } from '../services/AuthServices'

const router = Router()
export const auth = Router().use('/auth', router)

router.get('/', verifyToken, async (request, response) => {
  try {
    response.send("Access")
  } catch (error) {
    response.sendStatus(500)
  }
})

/**
 * 
 */
router.post('/login', AuthRules(), Validate, async (request, response) => {
  try {
    const isLogin = await AuthServices.Login({...request.body})
    if (!isLogin) return response.sendStatus(401)
    response.cookie('jwt', isLogin.refreshToken, {
      httpOnly: true,
      maxAge:4 * 60 * 60 * 1000,
    })
    response.send({ accessToken: isLogin.accessToken })
  } catch (error) {
    console.error(error)
    response.sendStatus(500)
  }
})

/**
 * 
 */
router.get('/logout', async (request, response) => {
  const cookies = request.cookies
  try {
    
    if (!cookies.jwt) return response.sendStatus(204)

    const userHasToken = await AuthServices.Logout(cookies.jwt)

    if (!userHasToken) {
      response.clearCookie('jwt', { httpOnly: true })
      return response.sendStatus(204)
    }

    response.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    response.sendStatus(204)

  } catch (error) {
    console.error(error)
    response.status(500)
  }
})

/**
 * 
 */
router.get('/refresh', async (request, response) => {
  const cookies = request.cookies
  try {

    if (!cookies.jwt) return response.sendStatus(401)
    
    let isToken = await AuthServices.Refresh(cookies.jwt)

    if (!isToken) return response.sendStatus(403)
    
    response.send(isToken)

  } catch (error) {
    console.error(error)
    response.send(500)
  }
})
