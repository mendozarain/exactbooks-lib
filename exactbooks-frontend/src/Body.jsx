import { Container, Flex, useColorModeValue, } from '@chakra-ui/react'
import * as React from 'react'
import Login from './authentication/Login'
import Register from './authentication/Register'
import ProtectedRoute from './authentication/ProtectedRoute'
import Home from './Pages/Home'
import BookDetail from './Pages/BookDetail'
import UpdateBook from './Pages/UpdateBook'
import AddBook from './Pages/AddBook'
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
          <Route path="/register" element={<Register funcNav={setShowNav}/>} />
          <Route path="/profile" element={ <Profile /> } />
          <Route path="/books/:id" element={ <BookDetail/>} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/update/:id" element={ <UpdateBook/>} />
      </Routes>
    </>
  )
}