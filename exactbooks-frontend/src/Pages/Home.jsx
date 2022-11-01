import { Container, Flex, useColorModeValue,Wrap, } from '@chakra-ui/react'
import * as React from 'react'
import Book from '../Components/Book'
export default function Home (props) {
  const jokesData= [{'setup':'hehe','punchline':'hoho'},{'setup':'nono','punchline':'koko'},{'setup':'nono','punchline':'koko'},{'setup':'nono','punchline':'koko'}]
  const Books = jokesData.map(joke => {
    return <Book setup={joke.setup} punchline={joke.punchline} />
  })

  return (
    <>
      <Flex bg={useColorModeValue('gray.50', 'gray.800')} role="main" direction="column"  minH={'100vh'} {...props}>
          <Wrap justify='center'>
            {Books}
          </Wrap>
      </Flex>
    </>
  )
}


