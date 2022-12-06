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
        limit: 50,
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

    // Filter tokens such that we only send tokens that can be properly rendered in the UI
    const filteredTokens = tokens
      .filter((t) => t.token.image && t.token.name && t.token.description)
      .map((t) => {
        t.token.image!.url = t.token.image!.url
          ? t.token.image!.url.replace('ipfs://', 'https://ipfs.io/ipfs/')
          : undefined
        return t.token
      })

    return {
      tokens: filteredTokens,
    }
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
