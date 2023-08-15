import { useState } from 'react';
import { Box, VStack, InputGroup, Divider, HStack } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import './ConversationPane.css'
import useMemoryStorage from '../../hooks/useMemoryStorage';
import * as api from '../../api/api';
import SendButton from "../accessories/SendButton";
import { Attachment, Message, MessageMedia } from '../../types';
import MessageBubble from "./MessageBubble";
import { botPending, getLastestUserQuery, removePendingMessages, replaceBotErrorBubbleWithPending, replaceBotPendingBubbleWithAnswer, replaceBotPendingBubbleWithError, streamingAnswer, userMessage } from "../../states/messages";
import useScrollToBottom from "../../hooks/useScrollToBottom";
import {texts} from '../../states/texts';
import ChatTextarea from './ChatTextarea';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import FadedButton from '../accessories/FadedButton';
import { b64DecodeUnicode, b64EncodeUnicode, uuid2number } from '../../utils/hashing';
import { s } from '../../states/texts';
import useLocale from '../../hooks/useLocale';
import useEffectOnce from '../../hooks/useEffectOnce';
import useSignal from '../../hooks/useSignal';
import { chunks, interlace } from '../../utils/array';
import {nanoid} from 'nanoid';
import FileUploadButton from '../accessories/UploadButton';
import AttachmentBox from '../accessories/AttachmentBox';
import { getWorkflowByTriggerWord } from '../../states/workflow';
import { useSettings } from '../../states/settings';

function ChatWindow() {
  const settings = useSettings();
  const llm = settings.llm;
  console.log('llm', llm);

  const showInitialPrompt = false;
  const enableAttachments = llm === 'Claude2';
  const {locale} = useLocale();
  const {isMobile} = useDeviceDetection();
  
  const [getMessages, setMessages] = useSignal<Message[]>([]);
  const typingHook = useState("");
  const [typing, setTyping] = typingHook;
  const nLineHook = useState(1);
  const [nLine, setNLine] = nLineHook;
  const [messagesViewRef, scrollToBottom] = useScrollToBottom();
  
  let [sessionID, setSessionID] = useMemoryStorage('chat-session-id', uuidv4());

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffectOnce(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const conversation = urlParams.get('conversation');
    
    if (!conversation) {
      handleInitialPrompt();
    } else {
      const {msg, sessionID} = JSON.parse(b64DecodeUnicode(decodeURIComponent(conversation)));
      setMessages(msg);
      setSessionID(sessionID);
    }
  }, '0');

  const handleInitialPrompt = async () => {
    if (!showInitialPrompt)
      return;
    
    const pair = uuidv4();
    const prompt = s(texts.welcomePrompts[0], {locale});

    const messagesWithPending: Message[] = [
      ...getMessages(),
      botPending(pair, sessionID)
    ];

    setMessages(messagesWithPending);
    scrollToBottom();

    try {
      const {media, answer} = await api.chat(prompt, sessionID, pair);
      setMessages(
        replaceBotPendingBubbleWithAnswer({
          messages: messagesWithPending,
          pair,
          media,
          answer,
          sessionID
        })
      );
      scrollToBottom();
    } catch (error: any) {
      setMessages(
        replaceBotPendingBubbleWithError({
          messages: messagesWithPending,
          errorMessage: error.message,
          pair,
          sessionID
        })
      );
    }
  };

  const handleReloadMessage = async (pair: string) => {
    const prevQuery = getLastestUserQuery(getMessages(), pair);
    if (!prevQuery) {
      return;
    }

    let msgsWithPending = replaceBotErrorBubbleWithPending({
      messages: getMessages(),
      pair,
      sessionID
    });
    try {
      setMessages(msgsWithPending);
      const {media, answer} = await api.chat(prevQuery, sessionID, pair);
      let msgsWithLatestAnswer = replaceBotPendingBubbleWithAnswer({
        messages: msgsWithPending,
        pair,
        media,
        answer,
        sessionID
      });
      setMessages(msgsWithLatestAnswer);
    } catch (error: any) {
      setMessages(
        replaceBotPendingBubbleWithError({
          messages: msgsWithPending,
          pair,
          errorMessage: error.message,
          sessionID
        })
      );
    }
  }
  
  const handleSendMessage = async (startNewSession: boolean) => {
    const prompt = typing.trim();
    if (!prompt) {
      return;
    }

    if (startNewSession) {
      sessionID = uuidv4();
      setSessionID(sessionID);
    }

    setNLine(1);
    setTyping('');

    const pair = nanoid(6);

    const messages = [
      ...getMessages(),
      userMessage(prompt, pair, sessionID, attachments)
    ];
    messages.push(botPending(pair, sessionID));
    setMessages(messages);

    setAttachments([]);
    scrollToBottom();

    const workflow = getWorkflowByTriggerWord(prompt);
    if (workflow) {
      await api.workflows(sessionID, pair, messages, [], workflow, (msg) => {
        setMessages(
          streamingAnswer({
            messages: getMessages(),
            pair,
            media: MessageMedia.Text,
            answer: msg,
            sessionID
          })
        );
      });
      return;
    }

    try {
      await api.chatStream(
        llm,
        sessionID,
        pair,
        removePendingMessages(getMessages()),
        attachments,
        (msg) => {
          setMessages(
            streamingAnswer({
              messages: getMessages(),
              pair,
              media: MessageMedia.Text,
              answer: msg,
              sessionID
            })
          );
        }
      );
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

  const onUploaded = (file: Attachment) => {
    console.log('converted_doc', file);
    setAttachments([...attachments, file]);
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
  const maxLines = isMobile ? 3: 10;
  const nLineLimited = nLine > maxLines ? maxLines : nLine;
  const hChatTextfield = `calc(${lh}em * ${nLineLimited} + 1em)`;

  // Separate messages into conversations by sessionID
  const conversations = chunks(getMessages(), (msg => uuid2number(msg.sessionID)));

  // Add a divider between conversations
  const history = interlace(conversations, 'divider');

  return (
    <Box pos="relative" h="calc(100vh - 80px)" minW={600} boxShadow='xs' overflow="hidden">
      <FadedButton size="sm" pos="absolute" top="0" right="2" zIndex="100" title="Copy share link"
        on={<CheckIcon />}
        off={<ExternalLinkIcon />}
        delay={1000}
        onClick={onShare}
      />
      <VStack
        ref={messagesViewRef}
        h="calc(100vh - 80px - 61px)"
        overflowY="auto"
        overflowX="auto"
        spacing='5'
        px={5}
        py={10}
      >
        {
          history.map((item, i) =>
            item === 'divider'
              ?
              <Divider key={i} color="gray.800" borderWidth="2px" marginY="2" />
              :
              <MessageBubble
                key={i}
                msg={item as Message}
                handleReloadMessage={handleReloadMessage}
              />
          )
        }
      </VStack>
      
      {/* Attachments to be uploaded */}
      <HStack pos="absolute" bottom={20} right={8}>
        {attachments.map((attachment, i) => <AttachmentBox key={i} attachment={attachment} />) }
      </HStack>
      
      <InputGroup background="white" w="100%" pos="absolute" left={0} bottom={0}>
        {<ChatTextarea
          size="lg"
          placeholder={isMobile ? "你想聊点什么..." : "Shift + Enter 换行、Cmd + Enter 开启新对话"}
          m={2}
          p={2}
          lineHeight={lh}
          h={hChatTextfield}
          minH={hChatTextfield}
          resize="none"
          typingHook={typingHook}
          nLineHook={nLineHook}
          onSendMessage={handleSendMessage}
          wordBreak="break-all"
        />}
        <HStack pr={2} color="blue.500" direction="column-reverse">
          {enableAttachments && <FileUploadButton onUploaded={onUploaded}/> }
          <SendButton onClick={handleSendMessage} cursor="pointer" />
        </HStack>
      </InputGroup>
    </Box>
  );
}

export default ChatWindow;
