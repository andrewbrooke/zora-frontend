import express, { Request, Response } from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import morgan, { StreamOptions } from 'morgan'

import api from './server/routes'
import Logger from './server/helpers/logger'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const logger = Logger('server')

app.prepare().then(async () => {
  const server = express()

  const stream: StreamOptions = {
    write: (message: any) => logger.http(message),
  }

  const skip = (req: Request, res: Response) => {
    // Remove verbose GET logging from Next
    return !req.baseUrl.startsWith('/api')
  }

  server.use(bodyParser.json())
  server.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream,
      skip,
    })
  )

  server.use('/api', api)

  server.get('*', (req: Request, res: Response) => {
    return handle(req, res)
  })

  server.listen(3000, (err?: any) => {
    if (err) throw err
    logger.info('Express listening on http://localhost:3000')
  })
})
