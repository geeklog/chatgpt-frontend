import { useState, useEffect } from 'react';
import { Box, VStack, InputGroup, Flex, Button } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import './ChatWindow.css'
import useMemoryStorage from './hooks/useMemoryStorage';
import * as api from './api/api';
import SendButton from "./components/icons/SendButton";
import { Message, MessageMedia, MessageStatus, Sender } from './types';
import MessageBubble from "./MessageBubble";
import { getLastestUserQuery, replaceBotErrorBubbleWithPending, replaceBotPendingBubbleWithAnswer, replaceBotPendingBubbleWithError } from "./states/MessagesHandler";
import useScrollToBottom from "./hooks/useScrollToBottom";
import texts from './states/texts';
import { randomChoose } from './utils/array';
import ChatTextarea from './ChatTextarea';
import useDeviceDetection from './hooks/useDeviceDetection';
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import FadedButton from './components/FadedButton';
import { b64DecodeUnicode, b64EncodeUnicode } from './utils/hashing';

function ChatWindow({userId}: {userId: string}) {
  const {isMobile} = useDeviceDetection();
  const [sessionID, setSessionID] = useMemoryStorage('chat-session-id', uuidv4());

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const conversation = urlParams.get('conversation');
    if (!conversation)
      return;
    const {msg, sessionID} = JSON.parse(b64DecodeUnicode(decodeURIComponent(conversation)));
    setMessages(msg);
    setSessionID(sessionID);
  }, []);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      msg: '欢迎使用ChatGPT',
      media: MessageMedia.Text,
      pair: '0',
      sender: Sender.Bot,
      status: MessageStatus.Normal,
      sessionID,
      time: new Date()
    }
  ]);
  const typingHook = useState("");
  const [typing, setTyping] = typingHook;
  const nLineHook = useState(1);
  const [nLine] = nLineHook;
  const [messagesRef, scrollToBottom] = useScrollToBottom();

  // useEffect(() => {
  //   handleInitialPrompt();
  // }, [sessionID]);

  const handleInitialPrompt = async () => {
    const prompt = randomChoose(texts.initialPrompts);

    const pair = uuidv4();

    const messagesWithPending: Message[] = [
      ...messages,
      {
        sender: Sender.Bot,
        media: MessageMedia.Text,
        msg: '...',
        status: MessageStatus.Pending,
        pair, sessionID,
        time: new Date()
      },
    ];

    setMessages(messagesWithPending);
    scrollToBottom();

    try {
      const {media, answer} = await api.chat(prompt, sessionID);
      setMessages(
        replaceBotPendingBubbleWithAnswer({messages: messagesWithPending, pair, media, answer, sessionID})
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
      const {media, answer} = await api.chat(prevQuery, sessionID);
      let msgsWithLatestAnswer = replaceBotPendingBubbleWithAnswer({messages: msgsWithPending, pair, media, answer, sessionID});
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

    setTyping('');

    const pair = uuidv4();

    const messagesWithPending: Message[] = [
      ...messages,
      {
        sender: Sender.User,
        media: MessageMedia.Text,
        msg: prompt,
        status: MessageStatus.Normal,
        pair,
        sessionID,
        time: new Date()
      },
      {
        sender: Sender.Bot,
        media: MessageMedia.Text,
        msg: '...',
        status: MessageStatus.Pending,
        pair,
        sessionID,
        time: new Date()
      }
    ];
    
    setMessages(messagesWithPending);
    scrollToBottom();

    try {
      const {media, answer} = await api.chat(typing, sessionID);
      setMessages(
        replaceBotPendingBubbleWithAnswer({messages: messagesWithPending, pair, media, answer, sessionID})
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

  const onShare = () => {
    navigator.clipboard.writeText(
      window.location + `?conversation=${
        encodeURIComponent(b64EncodeUnicode(JSON.stringify({
          msg: messages,
          sessionID
        })))
      }`
    );
  }

  const lh = 1.5;
  const hChatTextfield = `calc(${lh}em * ${nLine} + 1em)`;
  const hChatInput = `calc(${lh*1.12}em * ${nLine} + 2.2em)`
  const hMessages = `calc(100vh - (${lh*1.12}em * ${nLine} + 2.2em))`;

  return (
    <Box h="100%" w="100%" maxW="800px" bg="gray.100" pos="relative">
      <FadedButton size="sm" pos="absolute" top="1em" right="-1em" title="复制分享链接"
        on={<CheckIcon />}
        off={<ExternalLinkIcon />}
        delay={1000}
        onClick={onShare}
      />
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
          placeholder={isMobile ? "你想聊点什么..." : "Shift + Enter 换行"}
          m={2}
          p={2}
          lineHeight={lh}
          h={hChatTextfield}
          minH={hChatTextfield}
          resize="none"
          typingHook={typingHook}
          nLineHook={nLineHook}
          onSubmit={handleSendMessage}
          wordBreak="break-all"
        />}
        <Flex pr={2} pb={4} color="blue.500" direction="column-reverse">
          <SendButton onClick={handleSendMessage} cursor="pointer" />
        </Flex>
      </InputGroup>
    </Box>
  );
}

export default ChatWindow;
