import express, { Request, Response } from 'express'
import next from 'next'
import bodyParser from 'body-parser'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())

  server.get('/api', (req: Request, res: Response) => {
    return res.json({ message: 'Hello World!' })
  })

  server.get('*', (req: Request, res: Response) => {
    return handle(req, res)
  })

  server.listen(3000, (err?: any) => {
    if (err) throw err
    console.log('Express listening on http://localhost:3000')
  })
})
