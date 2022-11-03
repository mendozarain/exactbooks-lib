import React from "react"
import {
    Badge,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Link,
    Stack,
    Text,
    useColorModeValue,
    WrapItem,
  } from '@chakra-ui/react';
  import { useNavigate } from "react-router-dom";
  import { BookCover } from 'book-cover-3d'
  import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
  export default function Book(props) {
    const {books} = props
    if (books.length > 0){
    return (
      books.map((book, index) => {
        return(
            <Card book={book} />
        )
      })
    );
  }else{
    return(
      <>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      <Placeholder></Placeholder>
      </>
    
    )
  }
  }


  function Card(props){
    let navigate = useNavigate();

    const goToBook=(bookData)=>{
      const {book} = bookData
      let path = `books/`+book['book_id']; 
      navigate(path);
    }

    const {book} = props
    return(
        <WrapItem key={book.id}>
        <Center py={6}>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            w={{ sm: '100%', md: '540px' }}
            height={{ sm: '476px', md: '20rem' }}
            direction={{ base: 'column', md: 'row' }}
            bg={useColorModeValue('white', 'gray.900')}
            padding={4}>
            <Flex flex={1} >
            <button onClick={() => goToBook({book})} > 
              <BookCover
              rotate={40}
              rotateHover={20}
              perspective={1200}
              transitionDuration={1}
              radius={4}
              thickness={30}
              bgColor="#013220"
              width={250}
              height={300}
              pagesOffset={2}
              >
                <img src={book.cover_image} />
              </BookCover>
            </button>
            </Flex>
            <Stack
              flex={1}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={1}
              pt={2}>
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                  {book.title}
              </Heading>
              <Authors author={book.authors} />
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                px={3}>
                 {book.description}
              </Text>
              <Stack align={'center'}  direction={'row'} mt={6}>
                {book.status == 'available' ? (
                <Badge  rounded={'full'}  px={2}  fontWeight={'400'} py={1} variant='subtle' colorScheme='green'>
                      {book.status}
                </Badge>
                ) : (
                  <Badge rounded={'full'} px={2}  fontWeight={'400'} py={1} variant='subtle' colorScheme='red'>{book.status}</Badge>
                )}
              <Badge  rounded={'full'}  px={2}  fontWeight={'400'} py={1} variant='subtle' >{book.location}</Badge>
            </Stack>
            </Stack>
          </Stack>
        </Center>
      </WrapItem>
    )
  }

  function Authors(props) {
    const {author} = props
    return(
      author.map((authors, index) => {
        return(
          <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                {authors.name}
          </Text>
        )
     })
    )
  }
  function Placeholder(){
    return(
        <WrapItem>
        <Center py={6}>
        <Skeleton  rounded={'8'}>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            w={{ sm: '100%', md: '540px' }}
            height={{ sm: '476px', md: '20rem' }}
            direction={{ base: 'column', md: 'row' }}
            bg={useColorModeValue('white', 'gray.900')}
            padding={4}>
            <Flex flex={1} >
              <BookCover
              rotate={40}
              rotateHover={20}
              perspective={1200}
              transitionDuration={1}
              radius={4}
              thickness={30}
              bgColor="#013220"
              width={250}
              height={300}
              pagesOffset={2}
              >
              </BookCover>
            </Flex>
            <Stack
              flex={1}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={1}
              pt={2}>
              <Heading fontSize={'2xl'} fontFamily={'body'}>
              
              </Heading>
              
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                px={3}>
            
              </Text>
              <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  fontWeight={'400'}>
                  #art
                </Badge>
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  fontWeight={'400'}>
                  #photography
                </Badge>
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  fontWeight={'400'}>
                  #music
                </Badge>
              </Stack>
            </Stack>
          </Stack>
          </Skeleton>
        </Center>
      </WrapItem>

    )
  }