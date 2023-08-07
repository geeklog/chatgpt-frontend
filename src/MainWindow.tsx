import { Box, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Heading, useColorModeValue, useDisclosure, UseDisclosureReturn } from '@chakra-ui/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ConversationWindow from './components/chat/ConversationWindow'
import WorkflowEditor from './components/pe/WorkflowEditor'
import ExplorePage from './ExplorePage'
import { Nav } from './Nav'
import SettingsPage from './SettingsPage'
import { SidebarContent } from './Sidebar'
import { IconButtonRef } from './types'

const RightPane = ({ trigger, ctrl }: { trigger: IconButtonRef, ctrl: UseDisclosureReturn }) => {
  return (
    <Drawer
      isOpen={ctrl.isOpen}
      placement='right'
      size="lg"
      onClose={ctrl.onClose}
      finalFocusRef={trigger}
    >
      <DrawerOverlay />
      <DrawerContent overflowY={"auto"}>
        <DrawerCloseButton />
        <WorkflowEditor />
      </DrawerContent>
    </Drawer>
  )
}

const MainWindow = () => {
  const navCtrl = useDisclosure()
  const rightPaneCtrl = useDisclosure()
  const rightPaneTrigger = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <SidebarContent onClose={() => navCtrl.onClose} display={{ base: 'none', md: 'block' }} />
        <Drawer
          isOpen={navCtrl.isOpen}
          placement="left"
          onClose={navCtrl.onClose}
          returnFocusOnClose={false}
          onOverlayClick={navCtrl.onClose}
          size="full">
          <DrawerContent>
            <SidebarContent onClose={navCtrl.onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <Nav
          nav={{ control: navCtrl }}
          rightPane={{ trigger: rightPaneTrigger, control: rightPaneCtrl }}
        />
        <Box ml={{ base: 0, md: 48 }} h="calc(100vh - 80px)">
          <Routes>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/" element={<ConversationWindow chat="azure-chatgpt3" />} />
          </Routes>
        </Box>
      </Box>
      <RightPane trigger={rightPaneTrigger} ctrl={rightPaneCtrl} />
    </>
  )
}

export default MainWindow