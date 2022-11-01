import { Container, Flex, useColorModeValue, } from '@chakra-ui/react'
import * as React from 'react'
import Login from './authentication/Login'
import ProtectedRoute from './authentication/ProtectedRoute'
import Home from './Pages/Home'
import BookDetail from './Pages/BookDetail'
import Profile from './Pages/Profile'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header  from './Components/Header'

export default function Body () {
  const [showNav, setShowNav] = React.useState(true);
  return (
    <>
     {showNav &&
        <nav>
            <Header />
        </nav>
      } 
      <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute> } />
          <Route path="/login" element={<Login funcNav={setShowNav}/>} />
          <Route path="/profile" element={ <Profile /> } />
          <Route path="/books/detail/:id" element={ <BookDetail/>} />
      </Routes>
    </>
  )
}