import { IconButton, Avatar, Box, Flex, HStack, VStack, Icon, useColorModeValue, Text, FlexProps, Menu, MenuButton, MenuDivider, MenuItem, MenuList, UseDisclosureReturn, Button } from '@chakra-ui/react'
import { FiCompass, FiMenu, FiBell, FiChevronDown, FiShare } from 'react-icons/fi'
import { IconType } from 'react-icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { IconButtonRef } from './types'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { globalModelConfigs, ModelConfig } from './states/llm'
import { useSettings } from './states/settings'

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

function ModelItem({model}: {model: ModelConfig}) {
  return (<HStack>
    <Avatar
      size="xs"
      src={`/avatars/${model.icon}`}
      objectPosition="center"
    />
    <Text bg={model.bg} color={model.fg}>{model.name}</Text>
  </HStack>);
}

function ModelSelector() {
  const settings = useSettings();
  const llm = settings.llm;
  const cfg = globalModelConfigs[llm];
  const {ChatGPT, Claude2, GPT4} = globalModelConfigs;
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="white" size="lg">
      <HStack>
        <Avatar
          size="xs"
          src={`/avatars/${cfg.icon}`}
          objectPosition="center"
        />
        <Text>{cfg.name}</Text>
      </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem bg={ChatGPT.bg} color={ChatGPT.fg} onClick={() => settings.setLLM('ChatGPT')}>
          <ModelItem model={ChatGPT} />
        </MenuItem>
        <MenuItem bg={GPT4.bg} color={GPT4.fg} onClick={() => settings.setLLM('GPT4')}>
          <ModelItem model={GPT4} />
        </MenuItem>
        <MenuItem bg={Claude2.bg} color={Claude2.fg} onClick={() => settings.setLLM('Claude2')}>
          <ModelItem model={Claude2} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
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
        Mindset
      </Text>
      <ModelSelector />
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
                    '/avatars/chatgpt.webp'
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