import { Text, Image, Box, Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Grid, Heading, Stack } from "@chakra-ui/react";
import { Workflow, workflows } from "./states/workflow";

const WorkflowCard = ({workflow}: {workflow: Workflow}) => <Card maxW='sm'>
  <CardBody>
    <Image
      src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
      alt='Green double couch with wooden legs'
      borderRadius='lg'
    />
    <Stack mt='6' spacing='3'>
      <Heading size='md'>{workflow.title}</Heading>
      <Text>
        {workflow.description}
      </Text>
      <Text color='blue.600' fontSize='2xl'>
        {workflow.triggerWords}
      </Text>
    </Stack>
  </CardBody>
  <Divider />
  <CardFooter>
    <ButtonGroup spacing='2'>
      <Button variant='solid' colorScheme='blue'>
        Select
      </Button>
      <Button variant='ghost' colorScheme='blue'>
      </Button>
    </ButtonGroup>
  </CardFooter>
</Card>

const ExplorePage = () => {
  
  return (
    <Box bg="white" h="100%" p={10}>
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
      {
        Object.values(workflows).map((workflow) =>
          <WorkflowCard workflow={workflow} />
        )
      }
      </Grid>
    </Box >
  );
};

export default ExplorePage;
