import jwt from 'jsonwebtoken'

export const verifyToken = (request, response, next) => {
  const authHeader = request.headers['authorization'];
  if (!authHeader) return response.sendStatus(401)
  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN,
    (err, decoded) => {
      if (err) return response.sendStatus(403)
      request.user = decoded.username
      next()
    }
  )
}
