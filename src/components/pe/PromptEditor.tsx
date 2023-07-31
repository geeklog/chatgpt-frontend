import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading, Tag, Textarea } from '@chakra-ui/react';
import { useWorkflow } from '../../states/workflow';

export default function PromptEditor(props: any) {
  const [workflow, workflowAction] = useWorkflow('fusion1');

  const genChangeHandler = (index: number) => (event: any) => {
    switch(index) {
      case 1:
        workflowAction.changeTemplate1(event.target.value);
        break;
      case 2:
        workflowAction.changeTemplate2(event.target.value);
        break;
      case 3:
        workflowAction.changeTemplate3(event.target.value);
        break;
      default:
        throw `Unknown step:${index}`;
    }
  };

  return (
    <Box bg="white" p="5" w="100%" maxW="600px" boxShadow='xs' h="calc(100vh - 80px)" overflowY="auto">
      <Heading size="lg">{workflow.title}</Heading>
      <Box my={5}>
        <Tag bg="green.100">trigger words</Tag> <Tag bg="yellow.100">{workflow.triggerWords}</Tag>
      </Box>
      <Accordion defaultIndex={[0]} h="100%" allowMultiple>
        {workflow.steps.map((step, i) => 
          <AccordionItem key={i}>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                  <Tag bg="blue.100" fontWeight="bold">Step {i+1}</Tag> {step.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Textarea bg="gray.50" fontFamily="Monaco" fontWeight="light"
                onChange={genChangeHandler(i+1)}
                value={step.prompt}
              />
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Box>
  );
}