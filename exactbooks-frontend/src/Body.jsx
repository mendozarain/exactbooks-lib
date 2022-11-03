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
import {BrowserRouter as Router, Routes, Route,Navigate} from 'react-router-dom'
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
          <Route path="/"  element={<ProtectedRoute> <Home funcNav={setShowNav} /> </ProtectedRoute> } />
          <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> } />
          <Route path="/books/:id" element={ <ProtectedRoute>  <BookDetail/> </ProtectedRoute>} />
          <Route path="/books/add" element={<ProtectedRoute> <AddBook /> </ProtectedRoute>} />
          <Route path="/books/update/:id" element={ <ProtectedRoute> <UpdateBook/> </ProtectedRoute>} />
          <Route path="*" element={<Navigate replace to="/" />} />
          <Route path="/login" element={<Login funcNav={setShowNav}/>} />
          <Route path="/register" element={<Register funcNav={setShowNav}/>} />
      </Routes>
    </>
  )
}