import { useState, useEffect } from 'react';
import { Box, VStack, Tooltip } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import './ChatWindow.css'
import useMemoryStorage from './hooks/useMemoryStorage';
import * as api from './api/api';
import SendButton from "./components/icons/SendButton";
import { Message, MessageStatus, Sender } from './types';
import MessageBubble from "./MessageBubble";
import { getLastestUserQuery, replaceBotErrorBubbleWithPending, replaceBotPendingBubbleWithAnswer, replaceBotPendingBubbleWithError } from "./states/MessagesHandler";
import useScrollToBottom from "./hooks/useScrollToBottom";
import texts from './states/texts';
import { randomChoose } from './utils/array';

function ChatWindow({userId}: {userId: string}) {
  const [sessionID] = useMemoryStorage('chat-session-id', uuidv4());
  const [messages, setMessages] = useState<Message[]>([
    {
      msg: '欢迎使用ChatGPT',
      pair: '0',
      sender: Sender.Bot,
      status: MessageStatus.Normal,
      sessionID
    }
  ]);
  const [typing, setTyping] = useState('');
  const [messagesRef, scrollToBottom] = useScrollToBottom();

  // useEffect(() => {
  //   handleInitialPrompt();
  // }, [sessionID]);

  const handleInitialPrompt = async () => {
    const prompt = randomChoose(texts.initialPrompts);

    const pair = uuidv4();

    const messagesWithPending = [
      ...messages,
      {sender: Sender.Bot, msg: '...', status: MessageStatus.Pending, pair, sessionID},
    ];

    setMessages(messagesWithPending);
    scrollToBottom();

    try {
      const answer = await api.chat(prompt, sessionID);
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
    const prompt = typing.trim();
    if (!prompt) {
      return;
    }

    const pair = uuidv4();

    const messagesWithPending = [
      ...messages,
      {sender: Sender.User, msg: prompt, status: MessageStatus.Normal, pair, sessionID},
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
    <Box h="100%" w="100%" maxW="800px" bg="gray.100" style={{position: 'relative'}}>
      <VStack
        ref={messagesRef}
        h="100%"
        maxH="calc(100% - 3rem)"
        overflowY="auto"
        overflowX="hidden"
        spacing='5'
        px={5}
        py={10}
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
      <InputGroup pl={2} pr={2}>
        <Input
          size="lg"
          type="text"
          placeholder="你想聊点什么..."
          value={typing}
          onChange={(e) => setTyping(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <InputRightElement
          h="100%"
          pr={2}
          color="blue.500"
          children={<SendButton onClick={handleSendMessage} />}
        />
      </InputGroup>
    </Box>
  );
}

export default ChatWindow;
