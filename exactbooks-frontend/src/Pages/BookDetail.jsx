import * as React from 'react'
import { Placeholder } from '../components/Placeholder'
import { Footer } from '../components/Footer'
import { NavLink, Link  } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import {
  Button,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Container,
  Box,
  Flex,
  VStack,
  SimpleGrid,
  StackDivider,
  List,
  ListItem,
  Center,
  Avatar,
  Badge,
  Spacer,
  useToast,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import { BookCover } from 'book-cover-3d';
import {configAxios}  from '../helpers/axios-config';
export default function UpdateBook (props) {
  const { id } = useParams();
  
  const [book, getBookData] = React.useState(null)

  React.useEffect(() => {
     getBook();
  }, []);

  const getBook = () => {
     axios.get(axios.defaults.baseURL+'books/'+id)
      .then((response) => {
        getBookData(response.data)
      })
      .catch((error) => {
      });
   }

  return (
    <>
      {book ?  <Card book={book}/> :  <></>}
    </>
  )
}

const Card = (props) => {
  const navigate = useNavigate();
  const toast = useToast()
  const [error, getError] = React.useState({
    'status':"",
    "message":""
  })
  const [checkedout, getCheckedOut] = React.useState({
    'status':false,
  })
  const { id } = useParams();

  function update(id){
    navigate('/books/update/'+id)
  }
      React.useEffect(() => {
        getBookCheckout();
    }, []);

    const getBookCheckout = () => {
        axios.get(axios.defaults.baseURL+'books/ischeckedout/'+id)
        .then((response) => {
          isCheckedOutByMe(response.data.status)
        })
        .catch((error) => {
        });
      }

    function isCheckedOutByMe(status){
    
      if(status==true){
        getCheckedOut(prevFormData => {
          return {
              ...prevFormData,
              status:true,
          }
       })
      }
    }
   const handleSubmit = async (id) =>{
      let form_data = new FormData();
      form_data.append('book_id', id);
      let res = await axios.post(axios.defaults.baseURL+'books/checkout/', form_data,configAxios)
      .then(response => {
        navigate("/");
      })
      .catch(error => { 
        console.log(error.response)      
          getError(prevFormData => {
            return {
                ...prevFormData,
                status:'Checkout Failed',
                message:error.response.data.status,
            }
         })
      });
  }
  const handleReturn= async (id) =>{
    let form_data = new FormData();
    form_data.append('book_id', id);
    let res = await axios.post(axios.defaults.baseURL+'books/return/', form_data,configAxios)
    .then(response => {
      navigate("/");
    })
    // .catch(error => {    
    //   console.log(error.response)   
    //     getError(prevFormData => {
    //       return {
    //           ...prevFormData,
    //           status:'Return Failed',
    //           message:error.response.data.status,
    //       }
    //    })
    // });
 }
  const book = props.book
  props.UpdateBook
  return (
    <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 40 }}
        py={{ base: 18, md: 24 }}>
          <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Flex>
              <Box  >
              <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {book.title}
             </Heading>
              </Box>
              <Spacer />  
              <Box >
                <Button onClick={() => update(book.book_id)} colorScheme='teal' size='md'>
                  Update Book Details
                </Button>
              </Box>
            </Flex>
              
            <Text
              color={useColorModeValue('gray.900', 'gray.400')}
              fontWeight={300}
              fontSize={'2xl'}>
              <Authors authors={book.authors} />
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
          </Box>
        
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              />
            }>
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text fontSize={'lg'}>
                  {book.description}
              </Text>
            </VStack>
            <Box>
          
          <Stack mt={0} direction={'row'} spacing={4} align={'center'}>
           <Avatar
            src={"https://exactbooks.b-cdn.net"+book.owner.image}
            alt={'Author'}
            />
            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
              <Text fontWeight={600}> {book.owner.full_name}</Text>
              <Text color={'gray.500'}>Owner</Text>
              </Stack>
            </Stack>           
            </Box>
          </Stack>
          {book.status == 'available' ? (
              <Button
              rounded={'10'}
              w={'full'}
              mt={8}
              size={'lg'}
              py={'7'}
              onClick={() =>
                handleSubmit((book.book_id))
              }
              bg={useColorModeValue('green.400', 'green.900')}
              color={useColorModeValue('white', 'gray.900')}
              textTransform={'uppercase'}
              _hover={{
                transform: 'translateY(2px)',
                boxShadow: 'lg',
              }}>
              Checkout
            </Button>
            ) : (
              <>
              </>
            )}
            {error.status == 'Checkout Failed' ? (
               <Alert status='error'  variant='subtle' rounded={8}>
               <AlertIcon />
                   {error.message}
                 </Alert>
            ) : (
              <></>
            )}
          {checkedout.status == true ? (
          <Stack mt={0} direction={'row'} spacing={4} align={'center'}>
          <Alert status='success'  variant='subtle' rounded={8}>
                 <AlertIcon />
                   Checked out Sucessfully 
               </Alert>

                <Button
                rounded={'10'}
                w={'full'}
                mt={8}
                size={'lg'}
                py={'7'}
                onClick={() =>
                  handleReturn((book.book_id))
                }
                bg={useColorModeValue('green.400', 'green.900')}
                color={useColorModeValue('white', 'gray.900')}
                textTransform={'uppercase'}
                _hover={{
                  transform: 'translateY(2px)',
                  boxShadow: 'lg',
                }}>
                RETURN
                </Button>
            </Stack>        
            ) : (
              <></>
            )}
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'lg'}
            letterSpacing={1.1}>
            Comments
          </Text>
            <CommentInput></CommentInput>
          <Stack direction="row" >
               <Comment></Comment>
          </Stack>
          <Stack direction="row" >
               <Comment></Comment>
          </Stack>
          <Stack direction="row" >
               <Comment></Comment>
          </Stack>
          <Stack direction="row" >
               <Comment></Comment>
          </Stack>
          <Stack direction="row" >
               <Comment></Comment>
          </Stack>
        </Stack>
        <Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
        <BookCover
              rotate={20}
              rotateHover={40}
              perspective={1200}
              transitionDuration={1}
              radius={4}
              thickness={100}
              bgColor="#013220"
              width={500}
              height={700}
              pagesOffset={2}
              >
                <img src={book.cover_image} />
              </BookCover>
          </Stack>
        </Flex>
      </SimpleGrid>
    </Container>
  );
}

function Authors(props) {
  const author = props.authors
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

 function Comment() {
  return (
      <Box
        maxW={'full'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        <Stack mt={1} mb={1} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
            alt={'Author'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>Achim Rolle</Text>
            <Text color={'gray.500'}>Feb 08, 2021 · 6min read</Text>
          </Stack>
        </Stack>
        <Stack>
          <Text color={'gray.500'}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum.
          </Text>
        </Stack>
      </Box>
  );
}


function CommentInput(prop) {
  return (
      <Box
        maxW={'full'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        <Stack mt={1} mb={1} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
            alt={'Author'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>Achim Rolle</Text>

          </Stack>
        </Stack>
        <Stack>
        <FormControl>
          <FormLabel></FormLabel>
          <Textarea
            name="comment"
            placeholder="What do you think about the book?"
            rows={4}
            resize="none"
          />
        </FormControl>
        </Stack>
      </Box>
  );
}



function ToastError() {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }
    >
      Show Toast
    </Button>
  )
}

