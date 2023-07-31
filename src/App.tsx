import { extendTheme, ChakraBaseProvider } from '@chakra-ui/react'
import SettingPage from './SettingsPage';
import MainWindow from './MainWindow';
import { WorkflowContext, workflows } from './states/workflow';

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
      <WorkflowContext.Provider value={workflows}>
        <MainWindow />
      </WorkflowContext.Provider>
      <SettingPage />
    </ChakraBaseProvider>
  )
}

export default App;