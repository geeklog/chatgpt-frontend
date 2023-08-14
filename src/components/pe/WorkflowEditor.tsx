import { ChevronDownIcon } from '@chakra-ui/icons';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Button, FormLabel, Heading, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Tag, Text, Textarea } from '@chakra-ui/react';
import { MdPlayArrow, MdPlayCircleFilled } from "react-icons/md"
import { useWorkflow } from '../../states/workflow';
import { Attachment, ModelType } from '../../types';
import AttachmentBox from '../accessories/AttachmentBox';
import FileUploadButton from '../accessories/UploadButton';

const models: any = {
  ChatGPT: {
    fg: 'white',
    bg: '#11a37f',
    icon: 'chatgpt.webp'
  },
  Claude2: {
    fg: 'black',
    bg: '#cc9b7b',
    icon: 'claude.webp'
  }
};

function ModelItem({model}: {model: string}) {
  return (<HStack>
    <Avatar
      size="xs"
      src={`/avatars/${models[model].icon}`}
      objectPosition="center"
    />
    <Text bg={models[model].bg} color={models[model].fg}>{model}</Text>
  </HStack>);
}

function ModelSelector({model, setModel}: {model: ModelType, setModel: (model: ModelType) => void}) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" bg={models[model].bg}>
        <ModelItem model={model}/>
      </MenuButton>
      <MenuList>
        <MenuItem bg={models.ChatGPT.bg} color={models.ChatGPT.fg} onClick={() => setModel('ChatGPT')}>
          <ModelItem model="ChatGPT" />
        </MenuItem>
        <MenuItem bg={models.Claude2.bg} color={models.Claude2.fg} onClick={() => setModel('Claude2')}>
          <ModelItem model="Claude2" />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default function WorkflowEditor(props: any) {
  const [workflow, workflowAction] = useWorkflow('fusion1');
  
  const changeStepPrompt = (i: number) => (event: any) => {
    workflowAction.updateStep(i, {prompt: event.target.value});
  };
  const changeStepModel = (i: number) => (model: ModelType) => {
    workflowAction.updateStep(i, {model});
  };
  const changeStepAttachment = (i: number) => (attachment: Attachment) => {
    workflowAction.addAttachmentInStep(i, attachment);
  };

  return (
    <Box bg="white" p="5" w="100%" h="100%">
      <Heading size="lg" mb={10}>{workflow.title}</Heading>
      <Button leftIcon={<MdPlayArrow />} colorScheme='teal' variant='solid' size="sm">Run</Button>
      <Box my={5}>
        <Tag bg="green.100">trigger words</Tag> <Tag bg="yellow.100">{workflow.triggerWords}</Tag>
      </Box>
      <Accordion defaultIndex={[0]} h="100%" allowMultiple>
        {workflow.steps.map((step, i) =>
          <AccordionItem key={i}>
            <h2>
              <AccordionButton bg="gray.100">
                <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                  <Tag bg="blue.200" fontWeight="bold" mr={2}><MdPlayCircleFilled/>&nbsp;Step {i + 1}</Tag> {step.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <HStack mb={2}>
                <ModelSelector
                  model={step.model}
                  setModel={changeStepModel(i)}
                />
                {step.model === 'Claude2' &&
                  <FileUploadButton onUploaded={changeStepAttachment(i)}/>
                }
              </HStack>
              {step.attachments.length > 0 &&
                <HStack>
                  {step.attachments.map(attachment => <AttachmentBox attachment={attachment}/>)}
                </HStack>
              }
              <FormLabel mt="5" fontWeight="bold">Prompt</FormLabel>
              <Textarea bg="gray.50" fontFamily="Monaco" fontWeight="light"
                onChange={changeStepPrompt(i)}
                value={step.prompt}
              />
              <FormLabel mt="5" fontWeight="bold">Output</FormLabel>
              <Input value={step.output} disabled={i===workflow.steps.length-1}/>
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Box>
  );
}