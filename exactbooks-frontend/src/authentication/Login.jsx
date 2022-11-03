import React from 'react'
import axios from 'axios';
import {configAxios}  from '../helpers/axios-config';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    FormErrorMessage,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useNavigate } from "react-router-dom";


  export default function Login(props) {
    props.funcNav(false);
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        email: "",
        password:"",
        emailError:false,
        passwordError:false,
        emailErrorMessage:"",
        passwordErrorMessage:"",
    })
    function handleChange(event) {
      setFormData(prevFormData => {
          return {
              ...prevFormData,
              emailError:false,
              passwordError:false,
              [event.target.name]: event.target.value,

          }
      })
    }
    const handleSubmit = async (event) =>{
        event.preventDefault()
        let res = await axios.post(axios.defaults.baseURL+'users/login/', formData, configAxios)
        .then(response => {
          axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', response.data.user_id)
          localStorage.setItem('user_name', response.data.full_name)
          localStorage.setItem('user_image', "https://exactbooks.b-cdn.net"+response.data.image)
          localStorage.setItem('isAuthenticated', true)

          navigate("/");
        })
        .catch(error => {
          if (error.response.data.error) {
            setFormData(prevFormData => {
              return {
                ...prevFormData,
                emailError: true,
                passwordError: true,
                passwordErrorMessage: error.response.data.error[0],
              }
            })
          }
          if (error.response.data.email) {
            setFormData(prevFormData => {
              return {
                ...prevFormData,
                emailError: true,
                emailErrorMessage: error.response.data.email[0],
              }
            })
          }
          if (error.response.data.password) {
            setFormData(prevFormData => {
              return {
                ...prevFormData,
                passwordError: true,
                passwordErrorMessage: error.response.data.password[0],
              }
            })
          }
        });
    }
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Exactbooks</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
                Sign in to the best internal tool the world will never see!
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={formData.emailError}>
                <FormLabel>Email address</FormLabel>
                <Input name='email' onChange={handleChange}  type="email" />
                <FormErrorMessage>{formData.emailErrorMessage}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={formData.passwordError}>
                <FormLabel>Password</FormLabel>
                <Input name='password' onChange={handleChange}  type="password" />
                <FormErrorMessage>{formData.passwordErrorMessage}</FormErrorMessage>
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={'green.400'}
                  color={'white'}
                  _hover={{
                    bg: 'green.500',
                  }}
                  onClick={handleSubmit}
                  >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Text  align={'center'} fontSize={'lg'} color={'gray.600'}>
             Don't have an account yet? <Link onClick={() => navigate('/register')} color={'green.400'}>Sign up</Link> its free (for now ✌️)
            </Text>
        </Stack>
      </Flex>
    );
  }

  