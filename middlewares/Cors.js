import corsMiddleware from 'cors'

const options = {
  origin: (origin, callback) => {
    callback(null, true)
  }
}

export const cors = corsMiddleware(options)
