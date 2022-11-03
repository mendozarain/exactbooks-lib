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
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import axios from 'axios';
  import {configAxios}  from '../helpers/axios-config';
  import { useNavigate } from "react-router-dom";

  export default function Register() {
    // props.funcNav(false);
    
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = React.useState({
      email: "",
      password:"",
      confirm_password:"",
      first_name: "",
      last_name: "",
      emailError:false,
      first_nameError:false,
      last_nameError:false,
      passwordError:false,
      confirm_passwordError:false,
      first_nameErrorMessage:"",
      last_nameErrorMessage:"",
      emailErrorMessage:"",
      passwordErrorMessage:"",
      confirm_passwordMessage:"",
    })

    function handleChange(event) {
      setFormData(prevFormData => {
          return {
              ...prevFormData,
              emailError:false,
              first_nameError:false,
              last_nameError:false,
              passwordError:false,
              confirm_passwordError:false,
              [event.target.name]: event.target.value,

          }
      })
    }

    const handleSubmit = async (event) =>{
      event.preventDefault()
      let res = await axios.post(axios.defaults.baseURL+'users/register/', formData, configAxios)
      .then(response => {
        navigate("/login");
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
        if (error.response.data.confirm_password) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              confirm_passwordError: true,
              confirm_passwordErrorMessage: error.response.data.confirm_password[0],
            }
          })
        }
        if (error.response.data.first_name) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              first_nameError: true,
              first_nameErrorMessage: error.response.data.first_name[0],
            }
          })
        }
        if (error.response.data.last_name) {
          setFormData(prevFormData => {
            return {
              ...prevFormData,
              last_nameError: true,
              last_nameErrorMessage: error.response.data.last_name[0],
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
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={8}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired  isInvalid={formData.first_nameError}>
                    <FormLabel>First Name</FormLabel>
                    <Input name='first_name' onChange={handleChange} type="text" />
                    <FormErrorMessage>{formData.first_nameErrorMessage}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName"  isInvalid={formData.last_nameError}>
                    <FormLabel>Last Name</FormLabel>
                    <Input name='last_name' onChange={handleChange} type="text" />
                    <FormErrorMessage>{formData.last_nameErrorMessage}</FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired isInvalid={formData.emailError} >
                <FormLabel>Email address</FormLabel>
                <Input name='email' onChange={handleChange} type="email" />
                <FormErrorMessage>{formData.emailErrorMessage}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isRequired isInvalid={formData.passwordError}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input name='password' onChange={handleChange} type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formData.passwordErrorMessage}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isRequired isInvalid={formData.confirm_passwordError}>
                <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                  <Input name='confirm_password' onChange={handleChange} type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                  <FormErrorMessage>{formData.confirm_passwordMessage}</FormErrorMessage>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  onClick={handleSubmit}
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link onClick={() => navigate('/login')} color={'blue.400'}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
  