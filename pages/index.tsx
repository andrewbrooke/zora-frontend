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
  AspectRatio,
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

  function Media({
    token,
  }: {
    token: TokensQuery['tokens']['nodes'][0]['token']
  }) {
    // Detect type of media based on properties/values present
    const hasMimeType = (token: TokensQuery['tokens']['nodes'][0]['token']) =>
      !!(token.image && token.image.url && token.image.mimeType)

    const isVideo = (token: TokensQuery['tokens']['nodes'][0]['token']) =>
      !!(hasMimeType(token) && token.image!.mimeType!.startsWith('video'))

    const isImage = (token: TokensQuery['tokens']['nodes'][0]['token']) =>
      !!(hasMimeType(token) && token.image!.mimeType!.startsWith('image'))

    const hasValidMedia = (token: TokensQuery['tokens']['nodes'][0]['token']) =>
      isVideo(token) || isImage(token)

    return hasValidMedia(token) ? (
      isVideo(token) ? (
        <AspectRatio height={200} width={200} ratio={1} rounded={'md'}>
          <iframe title={token.name || undefined} src={token.image!.url!} />
        </AspectRatio>
      ) : (
        <Image
          rounded={'md'}
          src={token.image!.url!}
          fallbackSrc={'/image-default.png'}
          objectFit={'cover'}
          height={200}
          width={200}
          alt={token.name || undefined}
        />
      )
    ) : (
      // Default to local image placeholder if no media is available
      <Image
        rounded={'md'}
        src={'/image-default.png'}
        height={200}
        width={200}
        alt={token.name || undefined}
      />
    )
  }

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
              <Media token={token} />
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
              {isLoading ? <Spinner color='white' /> : null}
              {hasTokensData ? <Gallery tokens={nftResponse.tokens} /> : null}
            </Stack>
          </Container>
        </Flex>
      </main>
    </div>
  )
}
