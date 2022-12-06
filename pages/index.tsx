import useSWR from 'swr'
import Head from 'next/head'

import {
  Flex,
  Box,
  FormControl,
  Input,
  Stack,
  Link,
  Heading,
  Text,
  Image,
  Container,
  FormErrorMessage,
  FormHelperText,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react'

import React, { useState } from 'react'

import { TokensQuery } from '@zoralabs/zdk'

const fetcher = (input: RequestInfo | URL, init?: RequestInit | undefined) =>
  fetch(input, init).then((res) => res.json())

export default function Home() {
  const [address, setAddress] = useState('')

  const onAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
  }

  const isValidAddress = () => {
    // Only trigger API call if valid address/ENS is present
    return address && (address.endsWith('.eth') || address.length === 42)
  }

  const { data: nftResponse } = useSWR(
    isValidAddress() ? `/api/nft/${address}` : null,
    fetcher
  )

  const isFormInvalid =
    address.length > 0 && (!isValidAddress() || nftResponse?.message)

  const isLoading = !!(isValidAddress() && !nftResponse)
  const hasTokensData = !!(nftResponse && nftResponse.tokens)

  function Gallery({
    tokens,
  }: {
    tokens: TokensQuery['tokens']['nodes'][0]['token'][]
  }) {
    return (
      <SimpleGrid
        minChildWidth={['100%', null, '36ch', '36ch']}
        w={['100%', null, '80%']}
        spacing={'4'}
      >
        {tokens.map((token) => (
          <Box
            rounded={'lg'}
            bg={'white'}
            boxShadow={'lg'}
            p={4}
            key={`${token.collectionAddress}-${token.tokenId}`}
          >
            <Stack align={'center'} spacing={2}>
              {token.image && token.image.mediaEncoding ? (
                <Image
                  rounded={'md'}
                  src={token.image.mediaEncoding.original}
                  fallbackSrc={'/image-default.png'}
                  height={200}
                  width={200}
                  alt={token.name || undefined}
                />
              ) : null}
              <Text fontSize={'lg'}>{token.name}</Text>
              <Text fontSize={'md'} color='gray.600' noOfLines={2}>
                {token.description}
              </Text>
              <Link
                href={`https://etherscan.io/nft/${token.collectionAddress}/${token.tokenId}`}
                isExternal
                color={'blue.400'}
              >
                View on Etherscan
              </Link>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    )
  }

  return (
    <div>
      <Head>
        <title>Zora Gallery Next</title>
        <meta name='description' content='View your NFT gallery' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bgGradient='linear(to-br, cyan.800, pink.700)'
        >
          <Container maxW={'100%'} w={'100%'}>
            <Stack spacing={8} py={12} px={6} align={'center'}>
              <Stack align={'center'}>
                <Heading fontSize={'4xl'} color={'white'}>
                  NFT Gallery
                </Heading>
                <Text fontSize={'lg'} color={'white'}>
                  powered by{' '}
                  <Link href='https://zora.co/' isExternal color={'blue.400'}>
                    Zora
                  </Link>{' '}
                  ❤️
                </Text>
              </Stack>
              <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={8}
                w={'lg'}
                maxW={'100%'}
              >
                <Stack spacing={4}>
                  <FormControl id='address' isInvalid={isFormInvalid}>
                    <Input
                      type='text'
                      placeholder='jacob.eth'
                      onChange={onAddressChange}
                      value={address}
                    />
                    {isFormInvalid ? (
                      <FormErrorMessage>
                        Address must be a valid Ethereum address or ENS name
                      </FormErrorMessage>
                    ) : (
                      <FormHelperText>
                        Enter your Ethereum address or ENS name
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Box>
              {isLoading ? <Spinner /> : null}
              {hasTokensData ? <Gallery tokens={nftResponse.tokens} /> : null}
            </Stack>
          </Container>
        </Flex>
      </main>
    </div>
  )
}
