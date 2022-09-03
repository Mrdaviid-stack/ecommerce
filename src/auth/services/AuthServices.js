/// <reference path="../../../types/index.d.ts"/>
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { AuthModels } from "../models/AuthModels";

export class AuthServices {
  /**
   * @author Mark David Bogayan
   * @param {import("../../../types").Auth} Auth
   */
  static async Login(Auth) {

    const hasUser = await AuthModels.findUser(Auth.identity)

    if (!hasUser) return false

    const isMatch = await bcrypt.compare(Auth.password, hasUser[AuthModels.fields.password])

    if (!isMatch) return false

    const accessToken = jwt.sign(
      { "username": hasUser[AuthModels.fields.username] },
      process.env.ACCESS_TOKEN,
      { expiresIn: '60s' }
    )

    const refreshToken = jwt.sign(
      { "username": hasUser[AuthModels.fields.username] },
      process.env.REFRESH_TOKEN,
      { expiresIn: '60s' }
    )

    await AuthModels.updateToken(hasUser[AuthModels.fields.id], refreshToken)

    return { accessToken, refreshToken }

  }

  static async Logout(token) {

    const userHasToken = await AuthModels.findToken(token)

    if (!userHasToken) return false

    await AuthModels.updateToken(userHasToken[AuthModels.fields.id], token = null)

    return true
  }

  static async Refresh(token) {
  
    const hasRefreshToken = await AuthModels.findToken(token)

    if (!hasRefreshToken[AuthModels.fields.token]) return false

    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN,
      (err, decoded) => {
        console.log(decoded)
        if (err || hasRefreshToken[AuthModels.fields.username] !== decoded.username) return false
        const accessToken = jwt.sign(
          { "username": decoded.username },
          process.env.ACCESS_TOKEN,
          { expiresIn: '60s' }
        )
        return { accessToken }
      }
    )

  }
  
}