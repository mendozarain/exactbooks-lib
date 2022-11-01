import { Container, Flex, useColorModeValue, } from '@chakra-ui/react'
import * as React from 'react'
import { Placeholder } from '../components/Placeholder'
import { Footer } from '../components/Footer'
export default function BookDetail (props) {
  return (
    <>
      <Flex bg={useColorModeValue('gray.50', 'gray.800')} role="main" direction="column"  minH={'100vh'} {...props}>
        <Container flex="1">
          <Placeholder minH="lg" bg="bg-accent">
            BookDetail
          </Placeholder>
        </Container>
      </Flex>
    </>
  )
}