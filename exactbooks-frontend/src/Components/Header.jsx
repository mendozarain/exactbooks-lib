import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'


import * as React from 'react'
import { FiMenu } from 'react-icons/fi'
import { Logo } from './Logo'
import { NavLink, Link } from "react-router-dom";
 
export const Navbar = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  })
  return (
    <Box
    >
      <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
        <Container
          py={{
            base: '4',
            lg: '5',
          }}
        >
          <HStack spacing="20" justify="space-between">
            <Logo />
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="10">
                  <Link to="/" className="chakra-button css-1b8elh8">Home</Link>
                  <Link to="/profile" className="chakra-button css-1b8elh8">Profile</Link>
                  <Link to="/logout" className="chakra-button css-1b8elh8">Logout</Link>
                </ButtonGroup>
              </Flex>
            ) : (
              <IconButton
                variant="ghost"
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  )
}

function HeaderNavItem(props) {
  return (
    <NavLink
      to={props.to}
      className="nav-item"
      exact={props.exact ? true : false}
      activeClassName="active"
    >
      {props.name}
    </NavLink>
  );
}


export default Navbar;
