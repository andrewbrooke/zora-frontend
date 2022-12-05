import { Request, Response, Router } from 'express'

import { ZFError } from '../helpers/error'
import Logger from '../helpers/logger'
import { getNFTBalance } from '../controllers/zora'

const logger = Logger('routes:nft')
const router = Router()

/**
 * @route GET /nft/:address
 */
router.get('/:address', (req: Request, res: Response) => {
  const address = req.params.address

  logger.info(`Fetching NFTs for address ${address}`)

  getNFTBalance(address)
    .then((data) => {
      logger.debug(`Fetched NFTs for address ${address}`)
      logger.debug(data)
      return res.json(data)
    })
    .catch((err: ZFError) => {
      logger.error(err)
      return res.status(err.statusCode).json({ message: err.message })
    })
})

export default router
