import {Flex} from '@chakra-ui/react';
import { extendTheme, ChakraBaseProvider } from '@chakra-ui/react'
import ChatWindow from './ChatWindow';

const theme = extendTheme({ })

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <Flex h="100vh" w="100vw" alignItems="center" justifyContent="center">
        <ChatWindow userId="1" />
      </Flex>
    </ChakraBaseProvider>
  )
}

export default App;