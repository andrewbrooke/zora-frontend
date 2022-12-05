import { ZDK, ZDKChain, ZDKNetwork, TokensQuery } from '@zoralabs/zdk'

import Logger from '../helpers/logger'
import { BadRequestError, InternalServerError } from '../helpers/error'

const logger = Logger('controllers:zora')
const API_ENDPOINT = 'https://api.zora.co/graphql'

const zdk = new ZDK({
  endpoint: API_ENDPOINT,
  networks: [
    {
      chain: ZDKChain.Mainnet,
      network: ZDKNetwork.Ethereum,
    },
  ],
})

export const getNFTBalance = async (address: string) => {
  try {
    let tokens: TokensQuery['tokens']['nodes'] = []
    let endCursor: string | null | undefined = ''

    // Init base args: https://docs.zora.co/docs/guides/api-address-balance
    const args = {
      where: {
        ownerAddresses: [address],
      },
      pagination: {
        limit: 1,
        after: endCursor,
      },
    }

    do {
      // Update cursor
      args.pagination.after = endCursor

      const queryResult = await zdk.tokens(args)

      tokens = tokens.concat(queryResult.tokens.nodes)

      // Set new cursor if it exists
      endCursor = queryResult.tokens.pageInfo.hasNextPage
        ? queryResult.tokens.pageInfo.endCursor
        : null
    } while (endCursor)

    return tokens
  } catch (err: any) {
    // Rethrow suitable error
    if (err.message.includes('Address must be a valid address or ENS domain')) {
      throw new BadRequestError('Address must be a valid address or ENS domain')
    } else {
      logger.error(err.message)
      throw new InternalServerError()
    }
  }
}
