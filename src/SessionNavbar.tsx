import { Box, Flex, Spacer, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import ChatAvatar from './ChatAvatar';
import { Session } from "./types";
import { v4 as uuidv4 } from 'uuid';

function Navbar() {

  const sessions: Session[] = [
    {id: uuidv4(), title: 'HaAAAAA', history: []},
    {id: uuidv4(), title: 'HaBB', history: []},
    {id: uuidv4(), title: 'HaCCCCC', history: []},
  ];

  return (
    <Flex direction="column" p="0" bg="gray.200" alignItems="start" h="100%" pt="4">
      {sessions.map(sess =>
        <Button variant="ghost" borderRadius="0" w="100%" justifyContent="flex-start">
          <ChatAvatar id={sess.id} size="sm"/>{sess.title}
        </Button>
      )}
    </Flex>
  );
}

export default Navbar;