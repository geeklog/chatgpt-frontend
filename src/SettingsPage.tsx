import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Switch,
  Input,
  useMediaQuery,
  Button,
} from "@chakra-ui/react";
import { useSettings } from "./contexts/Settings";

const SettingPage = () => {
  const settings = useSettings();
  const { isOpen, onClose } = settings.modal!;
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [enableInitialPrompt, setEnableInitialPrompt] = useState(
    localStorage.getItem("enableInitialPrompt") === "true"
  );
  const [initialPrompt, setInitialPrompt] = useState(
    localStorage.getItem("initialPrompt") || ""
  );

  const handleEnableInitialPromptChange = (event: any) => {
    const value = event.target.checked;
    setEnableInitialPrompt(value);
    localStorage.setItem("enableInitialPrompt", value.toString());
  };

  const handleInitialPromptChange = (event: any) => {
    const value = event.target.value;
    setInitialPrompt(value);
    localStorage.setItem("initialPrompt", value);
  };

  const handleSaveSettings = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={!isMobile}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
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
            <FormControl mt="4">
              <FormLabel htmlFor="initial-prompt">Initial Prompt</FormLabel>
              <Input
                id="initial-prompt"
                placeholder="Enter initial prompt"
                value={initialPrompt}
                onChange={handleInitialPromptChange}
              />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSaveSettings}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingPage;
