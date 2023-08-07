import { IconButton, Avatar, Box, Flex, HStack, VStack, Icon, useColorModeValue, Text, FlexProps, Menu, MenuButton, MenuDivider, MenuItem, MenuList, UseDisclosureReturn } from '@chakra-ui/react'
import { FiCompass, FiMenu, FiBell, FiChevronDown, FiShare } from 'react-icons/fi'
import { IconType } from 'react-icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { IconButtonRef } from './types'

interface NavItemProps extends FlexProps {
  icon: IconType
  to: string
  children: React.ReactNode
}

interface NavProps extends FlexProps {
  nav: {
    control: UseDisclosureReturn
  },
  rightPane: {
    trigger: IconButtonRef,
    control: UseDisclosureReturn,
  }
}

export const NavItem = ({ icon, to, children, ...rest }: NavItemProps) => {
  return (
    <Link to={to}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{ bg: 'cyan.400', color: 'white' }}
        {...rest}>
        {icon && (
          <Icon mr="4" fontSize="16" _groupHover={{ color: 'white' }} as={icon} />
        )}
        {children}
      </Flex>
    </Link>
  )
}

export const Nav = ({ nav, rightPane, ...rest }: NavProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 48 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={nav.control.onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        AIPower
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <IconButton size="lg" variant="ghost" aria-label="share" icon={<FiShare />} />
        <IconButton size="lg" variant="ghost" aria-label="flow" icon={<FiCompass />} ref={rightPane.trigger} onClick={rightPane.control.onOpen} />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">Mike Wu</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>{"Sign out"}</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}