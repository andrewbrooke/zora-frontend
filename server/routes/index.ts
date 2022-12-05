import { Request, Response, Router } from 'express'

import nft from './nft'

const router = Router()

router.use('/nft', nft)

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello World!' })
})

router.get('*', (req: Request, res: Response) => {
  return res.status(404).json({ message: 'Route Not Found' })
})

export default router
