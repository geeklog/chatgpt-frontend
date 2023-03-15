import {Flex} from '@chakra-ui/react';
import { extendTheme, ChakraBaseProvider } from '@chakra-ui/react'
import ChatWindow from './ChatWindow';
import SessionNavbar from './SessionNavbar';

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: 'linear-gradient(-45deg, #700161, #9b67b5, #23a6d5, #23d5ab)',
        bgSize: '400% 400%'
      }
    })
  },
})

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <Flex h="100vh" w="100vw" alignItems="center" justifyContent="center">
        {/* <SessionNavbar /> */}
        <ChatWindow userId="1" />
      </Flex>
    </ChakraBaseProvider>
  )
}

export default App;