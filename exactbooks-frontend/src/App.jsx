import React from 'react'
import axios from 'axios';
import { Flex } from '@chakra-ui/react'
import {BrowserRouter as Router} from 'react-router-dom'
import Body from './Body';
// axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
axios.defaults.baseURL = 'https://exactbooks-backend.fly.dev/api/';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`
export default function App() {
      return (
          <div>
              <Router>
                    <Flex direction="column" flex="1">
                        <Body />
                    </Flex>
              </Router>
          </div>
      )
  };

