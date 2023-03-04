import { useState } from "react";
import { Box, VStack, Tooltip } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import './ChatWindow.css'
import useMemoryStorage from './hooks/useMemoryStorage';
import * as api from './api/api';
import SendButton from "./components/icons/SendButton";
import { QuestionIcon } from '@chakra-ui/icons';
import { Message, MessageStatus, Sender } from './types';
import MessageBubble from "./MessageBubble";
import { getLastestUserQuery, replaceBotErrorBubbleWithPending, replaceBotPendingBubbleWithAnswer, replaceBotPendingBubbleWithError } from "./states/MessagesHandler";
import useScrollToBottom from "./hooks/useScrollToBottom";

function ChatWindow({userId}: {userId: string}) {
  const [sessionID] = useMemoryStorage('chat-session-id', uuidv4());
  const [messages, setMessages] = useState<Message[]>([{
    msg: '欢迎使用ChatGPT，现已支持对话上下文功能，最大聊天记录为50条，超过会50条会清空，刷新或关掉页面也会清空',
    pair: '0',
    sender: Sender.Bot,
    status: MessageStatus.Normal,
    sessionID
  }]);
  const [typing, setTyping] = useState('');
  const [messagesRef, scrollToBottom] = useScrollToBottom();

  const handleReloadMessage = async (pair: string) => {
    const prevQuery = getLastestUserQuery(messages, pair);
    if (!prevQuery) {
      return;
    }

    let msgsWithPending = replaceBotErrorBubbleWithPending({messages, pair, sessionID});
    try {
      setMessages(msgsWithPending);
      const answer = await api.chat(prevQuery, sessionID);
      let msgsWithLatestAnswer = replaceBotPendingBubbleWithAnswer({messages: msgsWithPending, pair, answer, sessionID});
      setMessages(msgsWithLatestAnswer);
    } catch (error: any) {
      setMessages(
        replaceBotPendingBubbleWithError({messages: msgsWithPending, pair, errorMessage: error.message, sessionID})
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
      {sender: Sender.User, msg, status: MessageStatus.Normal, pair, sessionID},
      {sender: Sender.Bot, msg: '...', status: MessageStatus.Pending, pair, sessionID},
    ];
    
    setTyping('');
    setMessages(messagesWithPending);
    scrollToBottom();

    try {
      const answer = await api.chat(typing, sessionID);
      setMessages(
        replaceBotPendingBubbleWithAnswer({messages: messagesWithPending, pair, answer, sessionID})
      );
      scrollToBottom();
    } catch (error: any) {
      setMessages(
        replaceBotPendingBubbleWithError({
          messages: messagesWithPending, pair, errorMessage: error.message, sessionID
        })
      );
    }
  };

  return (
    <Box h="100%" w="100%" maxW="600px" bg="gray.100" style={{position: 'relative', paddingTop: '20px'}}>
      <VStack
        ref={messagesRef}
        h="100%"
        maxH="calc(100% - 3rem)"
        overflowY="auto"
        px={5}
        py={3}
      >
        {
          messages.map((msg, i) =>
            <MessageBubble
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
          placeholder="请在这里输入..."
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
