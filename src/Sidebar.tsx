import { Box, CloseButton, Flex, useColorModeValue, Text, BoxProps, Image } from '@chakra-ui/react'
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { NavItem } from './Nav'

interface SidebarProps extends BoxProps {
  onClose: () => void
}

interface LinkItemProps {
  name: string
  to: string
  icon: IconType
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', to: '/', icon: FiHome },
  { name: 'Trending', to: '/trending', icon: FiTrendingUp },
  { name: 'Explore', to: '/explore', icon: FiCompass },
  { name: 'Favourites', to: '/favourites', icon: FiStar },
  { name: 'Settings', to: '/settings', icon: FiSettings },
]

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 48 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="5" justifyContent="space-between">
        <Image src="/Logo.png" h={10} />
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          AIPower
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} to={link.to}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}