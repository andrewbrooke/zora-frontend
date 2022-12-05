import useSWR from 'swr'
import Head from 'next/head'

import {
  useColorModeValue,
  Flex,
  Box,
  FormControl,
  Input,
  Stack,
  Link,
  Heading,
  Text,
  Wrap,
  WrapItem,
  Image,
  Container,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

import React, { useState, useEffect } from 'react'

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
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Container maxW={'100%'} w={'100%'}>
            <Stack spacing={8} py={12} px={6} align={'center'}>
              <Stack align={'center'}>
                <Heading fontSize={'4xl'}>NFT Gallery</Heading>
                <Text fontSize={'lg'} color={'gray.600'}>
                  powered by{' '}
                  <Link href='https://zora.co/' isExternal color={'blue.400'}>
                    Zora
                  </Link>{' '}
                  ❤️
                </Text>
              </Stack>
              <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}
                w={'lg'}
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
              {nftResponse && nftResponse.tokens ? (
                <Wrap px='1rem' spacing={4} justify='center'>
                  {nftResponse.tokens.map(
                    (token: TokensQuery['tokens']['nodes'][0]['token']) => (
                      <WrapItem
                        key={`${token.collectionAddress}-${token.tokenId}`}
                        rounded={'lg'}
                        overflow='hidden'
                        w={'md'}
                      >
                        <Box rounded={'lg'} bg={'white'} boxShadow={'sm'} p={4}>
                          <Stack align={'center'} spacing={2}>
                            {token.image && token.image.mediaEncoding ? (
                              <Image
                                rounded={'md'}
                                src={token.image.mediaEncoding.original}
                                height={200}
                                width={200}
                                alt={token.name || undefined}
                              />
                            ) : null}
                            <Text fontSize={'lg'}>{token.name}</Text>
                            <Text
                              fontSize={'md'}
                              color='gray.600'
                              noOfLines={3}
                            >
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
                      </WrapItem>
                    )
                  )}
                </Wrap>
              ) : null}
            </Stack>
          </Container>
        </Flex>
      </main>
    </div>
  )
}
