import { useState } from 'react';
import { Box, VStack, InputGroup, Flex } from "@chakra-ui/react";
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
import ChatTextarea from './ChatTextarea';

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
  const nLineHook = useState(1);
  const [nLine] = nLineHook;
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

  const handleLineHeightChange = async (numLines: number) => {
    numLines++;
  }
  
  const handleSendMessage = async (typing: string) => {
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

  const lh = 1.5;
  const hChatTextfield = `calc(${lh}em * ${nLine} + 1em)`;
  const hChatInput = `calc(${lh*1.12}em * ${nLine} + 2.2em)`
  const hMessages = `calc(100vh - (${lh*1.12}em * ${nLine} + 2.2em))`;

  return (
    <Box h="100%" w="100%" maxW="800px" bg="gray.100" overflow="hidden" pos="relative">
      <VStack
        ref={messagesRef}
        h={hMessages}
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
      <InputGroup background="white" h={hChatInput} w="100%">
        {<ChatTextarea
          size="lg"
          placeholder="你想聊点什么..."
          m={2}
          p={2}
          lineHeight={lh}
          h={hChatTextfield}
          minH={hChatTextfield}
          resize="none"
          nLineHook={nLineHook}
          onLineHeightChange={handleLineHeightChange}
          onSubmit={handleSendMessage}
          wordBreak="break-all"
        />}
        <Flex pr={2} pb={4} color="blue.500" direction="column-reverse">
          <SendButton onClick={handleSendMessage} />
        </Flex>
      </InputGroup>
    </Box>
  );
}

export default ChatWindow;
