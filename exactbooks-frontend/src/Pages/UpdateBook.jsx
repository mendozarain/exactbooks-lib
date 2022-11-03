import React from 'react'
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    FormErrorMessage,
    Link,
    Container,
    Select,
    Textarea,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import axios from 'axios';
  import {configAxios}  from '../helpers/axios-config';
  import { useNavigate,useParams } from "react-router-dom";
  
  
  export default function UpdateBook() {
    const { id } = useParams();
    const navigate = useNavigate();


    const [formData, setFormData] = React.useState({
      title: "",
      status: "",
      location:"",
      authors:"",
      cover:"",
      book_type: "",
      description: "",
      titleError:false,
      book_typeError:false,
      descriptionError:false,
      locationError:false,
      authorError:false,
      coverError:false,
      statusError:false,
      book_typeErrorMessage:"",
      descriptionErrorMessage:"",
      titleErrorMessage:"",
      locationErrorMessage:"",
      authorErrorMessage:"",
      coverErrorMessage:"",
      statusErrorMessage:"",
    })
    const [cover, setCover] = useState(null);
 
    React.useEffect(() => {
      getBook();
    }, []);

    const getBook = () => {
      axios.get(axios.defaults.baseURL+'books/'+id)
        .then((response) => {
          let all_authors = ""
          response.data.authors.map((author, index) => {
              if (response.data.authors.length > 1){
                all_authors+=author.name+","
              }else all_authors = author.name
            })

          console.log(all_authors)
          setFormData(prevFormData => {
            return {
                ...prevFormData,
                title: response.data.title,
                status: response.data.status,
                location:response.data.location,
                authors:all_authors,
                book_type: response.data.book_type,
                description:response.data.description,
            }
        })
        })
        .catch((error) => {
        });
    }

    
    function handleChange(event) {
      setFormData(prevFormData => {
          return {
              ...prevFormData,
              titleError:false,
              book_typeError:false,
              descriptionError:false,
              locationError:false,
              authorError:false,
              [event.target.name]: event.target.value,

          }
      })
    }

    const handleSubmit = async (event) =>{
      event.preventDefault()
      let form_data = new FormData();
      form_data.append('id', id);
      if(cover!= null){
        form_data.append('cover', cover, cover.name);
      }
      form_data.append('title', formData['title']);
      form_data.append('status', formData['status']);
      form_data.append('location', formData['location']);
      form_data.append('authors', formData['authors']);
      form_data.append('book_type', formData['book_type']);
      form_data.append('description', formData['description']);
      
      let res = await axios.put(axios.defaults.baseURL+'books/update/', form_data,configAxios)
      .then(response => {
        navigate("/");
      })
      .catch(error => {
        if (error.response.data.error) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              titleError: true,
              locationError: true,
              locationErrorMessage: error.response.data.error[0],
            }
          })
        }
        if (error.response.data.title) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              titleError: true,
              titleErrorMessage: error.response.data.title[0],
            }
          })
        }
        if (error.response.data.location) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              locationError: true,
              locationErrorMessage: error.response.data.location[0],
            }
          })
        }
        if (error.response.data.authors) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              authorError: true,
              authorErrorMessage: error.response.data.author[0],
            }
          })
        }
        if (error.response.data.book_type) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              book_typeError: true,
              book_typeErrorMessage: error.response.data.book_type[0],
            }
          })
        }
        if (error.response.data.description) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              descriptionError: true,
              descriptionErrorMessage: error.response.data.description[0],
            }
          })
        }
        if (error.response.data.cover) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              coverError: true,
              coverErrorMessage: error.response.data.cover[0],
            }
          })
        }
        if (error.response.data.status) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              statusError: true,
              statusErrorMessage: error.response.data.status[0],
            }
          })
        }
      });
  }
  return (
    <Flex
      minH={'100vh'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Update Book 
        </Heading>
        <FormControl id="title" isRequired isInvalid={formData.titleError}>
          <FormLabel>Title</FormLabel>
          <Input
            onChange={handleChange}
            name="title"
            placeholder="Enter Book title"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={formData.title}
          />
            <FormErrorMessage>{formData.titleErrorMessage}</FormErrorMessage>
         </FormControl>
         <FormControl id="title" isRequired isInvalid={formData.statusError}>
          <FormLabel>Status</FormLabel>
            <Select name="status" onChange={handleChange}  value={formData.status} placeholder='Select option'>
                <option value='available'>Available</option>
                <option value='checked out'>Checked Out</option>
                <option value='damaged'>Damaged</option>
                <option value='lost'>Lost</option>
            </Select>
            <FormErrorMessage>{formData.statusErrorMessage}</FormErrorMessage>
         </FormControl>
         <FormControl id="authors" isRequired isInvalid={formData.authorError}>
          <FormLabel>Author</FormLabel>
          <Input
            onChange={handleChange}
            name="authors"
            placeholder="Enter Book Author Comma(,) for multiple Authors"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={formData.authors}
          />
            <FormErrorMessage>{formData.authorErrorMessage}</FormErrorMessage>
         </FormControl>
        <FormControl isRequired isInvalid={formData.book_typeError}>
          <FormLabel>Book Type</FormLabel>
          <Select name="book_type" value={formData.book_type}  onChange={handleChange} placeholder='Select option'>
            <option value='hardcover'>Hardcover</option>
            <option value='paperback'>Paperback</option>
            <option value='digital copy'>Digital Copy</option>
        </Select>
        <FormErrorMessage>{formData.book_typeErrorMessage}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            onChange={handleChange}
            name="description"
            placeholder="Book plot or short description"
            rows={4}
            resize="none"
            value={formData.description} 
          />
        </FormControl>
        <FormControl isRequired isInvalid={formData.locationError}>
          <FormLabel>Location</FormLabel>
          <Select name="location" value={formData.location}  onChange={handleChange} placeholder='Select option'>
            <option value='exactus office'>Exactus Office</option>
            <option value="owner's home">Owner's Home</option>
            <option value='in the matrix'>In the Matrix</option>
        </Select>
        <FormErrorMessage>{formData.locationErrorMessage}</FormErrorMessage>
        </FormControl>
        <FormControl id="cover" isInvalid={formData.coverError}>
          <FormLabel>Cover Image</FormLabel>
          <input type="file" accept="image/png, image/jpeg"  onChange={(e)=>{setCover(e.target.files[0])}}  />
            <FormErrorMessage>{formData.coverErrorMessage}</FormErrorMessage>
         </FormControl>
        <Stack spacing={6}>
          <Button
            onClick={handleSubmit}
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
  
