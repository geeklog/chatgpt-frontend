import { useState } from 'react';
import { Box, VStack, InputGroup, Flex } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import './ChatWindow.css'
import useMemoryStorage from './hooks/useMemoryStorage';
import * as api from './api/api';
import SendButton from "./components/icons/SendButton";
import { Message, MessageMedia, MessageStatus, Sender } from './types';
import MessageBubble from "./MessageBubble";
import { botPending, getLastestUserQuery, replaceBotErrorBubbleWithPending, replaceBotPendingBubbleWithAnswer, replaceBotPendingBubbleWithError, userMessage } from "./states/MessagesHandler";
import useScrollToBottom from "./hooks/useScrollToBottom";
import {texts} from './states/texts';
import ChatTextarea from './ChatTextarea';
import useDeviceDetection from './hooks/useDeviceDetection';
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import FadedButton from './components/FadedButton';
import { b64DecodeUnicode, b64EncodeUnicode } from './utils/hashing';
import { s} from './states/texts';
import useLocale from './hooks/useLocale';
import useEffectOnce from './hooks/useEffectOnce';
import useSignal from './hooks/useSignal';

function ChatWindow({userId}: {userId: string}) {
  const showInitialPrompt = false;
  const {locale} = useLocale();
  const {isMobile} = useDeviceDetection();
  
  const [getMessages, setMessages] = useSignal<Message[]>([]);
  const typingHook = useState("");
  const [typing, setTyping] = typingHook;
  const nLineHook = useState(1);
  const [nLine] = nLineHook;
  const [messagesViewRef, scrollToBottom] = useScrollToBottom();
  
  const [sessionID, setSessionID] = useMemoryStorage('chat-session-id', uuidv4());

  useEffectOnce(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const conversation = urlParams.get('conversation');
    if (!conversation) {
      handleInitialPrompt();
      return;
    }
    const {msg, sessionID} = JSON.parse(b64DecodeUnicode(decodeURIComponent(conversation)));
    setMessages(msg);
    setSessionID(sessionID);
  }, '0');

  const handleInitialPrompt = async () => {
    if (!showInitialPrompt)
      return;
    
    const pair = uuidv4();
    const prompt = s(texts.welcomePrompts[0], {locale});

    const messagesWithPending: Message[] = [
      ...getMessages(),
      {
        sender: Sender.Bot,
        media: MessageMedia.Text,
        msg: '...',
        status: MessageStatus.Pending,
        pair,
        sessionID,
        time: new Date()
      },
    ];

    setMessages(messagesWithPending);
    scrollToBottom();

    try {
      const {media, answer} = await api.chat(prompt, sessionID, pair);
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
    const prevQuery = getLastestUserQuery(getMessages(), pair);
    if (!prevQuery) {
      return;
    }

    let msgsWithPending = replaceBotErrorBubbleWithPending({messages: getMessages(), pair, sessionID});
    try {
      setMessages(msgsWithPending);
      const {media, answer} = await api.chat(prevQuery, sessionID, pair);
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

    setMessages([
      ...getMessages(),
      userMessage(prompt, pair, sessionID),
      botPending(pair, sessionID)
    ]);
    scrollToBottom();

    try {
      const {media, answer, pair: resPair} = await api.chat(typing, sessionID, pair);
      setMessages(
        replaceBotPendingBubbleWithAnswer({
          messages: getMessages(),
          pair: resPair,
          media,
          answer,
          sessionID
        })
      );
      scrollToBottom();
    } catch (error: any) {
      setMessages(
        replaceBotPendingBubbleWithError({
          messages: getMessages(),
          pair,
          errorMessage: error.message,
          sessionID
        })
      );
    }
  };

  const onShare = () => {
    navigator.clipboard.writeText(
      window.location + `?conversation=${
        encodeURIComponent(b64EncodeUnicode(JSON.stringify({
          msg: getMessages(),
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
    <Box h="100%" w="100%" maxW="800px" bg="gray.100" pos="relative"
      overflow="hidden"
    >
      <FadedButton size="sm" pos="absolute" top="1em" right="0.5em" title="复制分享链接"
        on={<CheckIcon />}
        off={<ExternalLinkIcon />}
        delay={1000}
        onClick={onShare}
      />
      <VStack
        ref={messagesViewRef}
        h={hMessages}
        overflowY="auto"
        overflowX="hidden"
        spacing='5'
        px={5}
        py={10}
      >
        {
          getMessages().map((msg, i) =>
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
