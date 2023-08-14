import { LockIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  Switch,
  Input,
  Box,
  InputGroup,
  InputLeftElement,
  Stack
} from "@chakra-ui/react";
import { useSettings } from "./contexts/Settings";
import { useLocalStorage } from "./hooks/useLocalStorage";

const SettingPage = () => {
  const settings = useSettings();

  const [enableInitialPrompt, setEnableInitialPrompt] = useLocalStorage('enableInitialPrompt', false);
  const [initialPrompt, setInitialPrompt] = useLocalStorage('initialPrompt', 'false');
  const [claudeSessionKey, setClaudeSessionKey] = useLocalStorage('claudeSessionKey', '');

  const handleEnableInitialPromptChange = (event: any) => {
    const value = event.target.checked;
    setEnableInitialPrompt(value);
  };

  const handleInitialPromptChange = (event: any) => {
    const value = event.target.value;
    setInitialPrompt(value);
  };

  const handleClaudeSessionKeyChange = (event: any) => {
    const value = event.target.value;
    setClaudeSessionKey(value);
  };

  return (
    <Box bg="white" h="100%"  >
      <Stack spacing={4} p={5} maxW={600} mx="auto">

        <FormControl>
          <FormLabel>Claude session Key</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <LockIcon color='gray.300' />
            </InputLeftElement>
            <Input
              id="claude-session-key"
              placeholder="Put your claude session key here"
              value={claudeSessionKey}
              onChange={handleClaudeSessionKeyChange}
            >
            </Input>
          </InputGroup>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="enable-initial-prompt" mb="0">
            Enable Initial Prompt
          </FormLabel>
          <Switch
            id="enable-initial-prompt"
            isChecked={enableInitialPrompt}
            onChange={handleEnableInitialPromptChange}
          />
        </FormControl>
        {enableInitialPrompt && (
          <FormControl>
            <FormLabel htmlFor="initial-prompt">Initial Prompt</FormLabel>
            <Input
              id="initial-prompt"
              placeholder="Enter initial prompt"
              value={initialPrompt}
              onChange={handleInitialPromptChange}
            />
          </FormControl>
        )}
      </Stack>
    </Box >
  );
};

export default SettingPage;
