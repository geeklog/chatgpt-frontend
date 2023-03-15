import {Flex} from '@chakra-ui/react';
import { extendTheme, ChakraBaseProvider } from '@chakra-ui/react'
import ChatWindow from './ChatWindow';
import SessionNavbar from './SessionNavbar';

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bgColor: '#3182ce'
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