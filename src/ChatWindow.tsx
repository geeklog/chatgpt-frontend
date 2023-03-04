import { useRef, useState } from "react";
import { Box, VStack, Tooltip, Button } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import './ChatWindow.css'
import useMemoryStorage from './hooks/useMemoryStorage';
import * as api from './api/api';
import SendButton from "./components/icons/SendButton";
import { QuestionIcon } from '@chakra-ui/icons';
import { Message, MessageStatus, Sender } from "./types";
import BubbleMessage from "./MessageBubble";
import { getLastestUserQuery, replaceBotErrorBubbleWithPending, replaceBotPendingBubbleWithAnswer, replaceBotPendingBubbleWithError } from "./states/MessagesHandler";

function ChatWindow({userId}: {userId: string}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  
  const [sessionID] = useMemoryStorage('chat-session-id', uuidv4());

  const scrollToBottom = () => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }

  const handleReloadMessage = async (pair: string) => {
    console.log('handleReload', pair)
    const prevQuery = getLastestUserQuery(messages, pair);
    if (!prevQuery) {
      return;
    }

    try {
      let r = replaceBotErrorBubbleWithPending(messages, pair);
      setMessages(r);
      console.log('a', r);
      const answer = await api.chat(prevQuery, sessionID);
      let rr = replaceBotPendingBubbleWithAnswer(r, pair, answer);
      console.log('b', rr);
      setMessages(rr);
    } catch (error: any) {
      console.log(error);
      setMessages(
        replaceBotPendingBubbleWithError(messages, pair, error.message)
      );
    }
  }
  
  const handleSendMessage = async () => {
    if (!typing.trim()) {
      return;
    }
    const msg = typing.trim();

    const pair = uuidv4();

    const messagesWithPending = [
      ...messages,
      {sender: Sender.User, msg, status: MessageStatus.Normal, pair},
      {sender: Sender.Bot, msg: '...', status: MessageStatus.Pending, pair},
    ];
    
    setTyping('');
    setMessages(messagesWithPending);
    scrollToBottom();

    try {
      const answer = await api.chat(typing, sessionID);
      setMessages(
        replaceBotPendingBubbleWithAnswer(messagesWithPending, pair, answer)
      );
      scrollToBottom();
    } catch (error: any) {
      setMessages(
        replaceBotPendingBubbleWithError(messagesWithPending, pair, error.message)
      );
    }
  };

  return (
    <Box h="100%" w="100%" maxW="600px" bg="gray.100" style={{position: 'relative'}}>
      <Tooltip label="现已支持对话上下文功能，最大聊天记录为50条，超过会50条会清空，刷新或关掉页面也会清空">
        <QuestionIcon boxSize="6" color="gray.600" style={{position: 'absolute', left: '1em', top: '1em'}} />
      </Tooltip>
      <VStack
        ref={messagesRef}
        h="100%"
        maxH="calc(100% - 3rem)"
        overflowY="auto"
        px={3}
        py={1}
      >
        {
          messages.map((msg, i) =>
            <BubbleMessage
              key={i}
              msg={msg}
              handleReloadMessage={handleReloadMessage}
            />
          )
        }
      </VStack>
      <InputGroup>
        <Input
          size="lg"
          type="text"
          placeholder="请在这里提问..."
          value={typing}
          onChange={(e) => setTyping(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <InputRightElement
          h="100%"
          children={<SendButton onClick={handleSendMessage} />}
        />
      </InputGroup>
    </Box>
  );
}

export default ChatWindow;
