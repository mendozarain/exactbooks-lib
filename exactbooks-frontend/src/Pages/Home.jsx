import { Container, Flex, useColorModeValue,Wrap, } from '@chakra-ui/react'
import * as React from 'react'
import Book from '../Components/Book'
import axios from 'axios';

export default function Home (props) {
  const [books, getBooksData] = React.useState('');
  props.funcNav(true);
  React.useEffect(() => {
     getBooks();
  }, []);

  const getBooks = () => {
     axios.get(axios.defaults.baseURL+'books/', { headers: {"Authorization" : `Token ${localStorage.getItem('token')}`} })
      .then((response) => {
        getBooksData(response.data)
      })
      .catch((error) => {
      });
   }
   
  return (
    <>
      <Flex bg={useColorModeValue('gray.50', 'gray.800')} role="main" direction="column"  minH={'100vh'} {...props}>
          <Wrap justify='center'>
                <Book books={books} />
          </Wrap>
      </Flex>
    </>
  )
}
