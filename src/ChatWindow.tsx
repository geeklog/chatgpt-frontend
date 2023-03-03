import { useRef, useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import './ChatWindow.css'
import Loading from "./components/Loading";
import useMemoryStorage from './hooks/useMemoryStorage';
import * as api from './api/api';

enum Sender {
  User,
  Bot
}

enum MessageStatus {
  Normal,
  Pending,
  Error
}

interface Message {
  sender: Sender;
  msg: string;
  status: MessageStatus,
  pair?: string; // 用来标记移除Pending
}

const removePending = (msgs: Message[], pair: string) =>
msgs.filter(msg => msg.pair !== pair);

function ChatWindow({userId}: {userId: string}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const messagesRef = useRef(null);
  
  const [sessionID] = useMemoryStorage('chat-session-id', uuidv4());
  
  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    const msg = message.trim();

    const pair = uuidv4();

    const messagesWithPending = [
      ...messages,
      {sender: Sender.User, msg, status: MessageStatus.Normal},
      {sender: Sender.Bot, msg: '...', status: MessageStatus.Pending, pair},
    ];
    
    setMessage('');
    setMessages(messagesWithPending);

    try {
      const answer = await api.chat(message, sessionID);
      setMessages([
        ...removePending(messagesWithPending, pair),
        {sender: Sender.Bot, msg: answer, status: MessageStatus.Normal, pair}
      ]);
    } catch (error: any) {
      setMessages([
        ...removePending(messagesWithPending, pair),
        {sender: Sender.Bot, msg: error.message, status: MessageStatus.Error, pair}
      ]);
    }
  };

  return (
    <Box h="100%" w="100%" maxW="600px" bg="gray.100">
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
            <BubbleMessage key={i} {...msg}></BubbleMessage>
          )
        }
      </VStack>
      <InputGroup>
        <Input
          type="text"
          placeholder="请在这里提问..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <InputRightElement
          children={<SendButton onClick={handleSendMessage} />}
        />
      </InputGroup>
    </Box>
  );
}

// 按钮组件，这里采用 SVG 图标作为按钮
function SendButton(props: any) {
  return (
    <svg
      onClick={props.onClick}
      fill="currentColor"
      viewBox="0 0 24 24"
      height="24px"
      width="24px"
      display="inline-block"
      {...props}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

// 聊天气泡组件
function BubbleMessage(msg: Message) {
  const isSelf = msg.sender==Sender.User;
  const isError = msg.status === MessageStatus.Error;
  const bg = isError ? "red.500" : (isSelf ? "blue.500" : "gray.500");
  const textColor = isSelf ? "white" : "gray.50";
  const justify = isSelf ? "flex-end" : "flex-start";
  const bubbleStyle = {
    display: "inline-block",
    maxWidth: "80%",
    padding: "0.5rem 1rem",
    borderRadius: "1rem",
    backgroundColor: "gray.300",
  };

  return (
    <Box w="100%" display="flex" justifyContent={justify} mb={3}>
      <Box
        backgroundColor={bg}
        color={textColor}
        style={bubbleStyle}
      >
        { msg.status === MessageStatus.Pending
            ? <Loading/>
            : msg.msg.split('\n').map(m => <div>{m}</div>)
        }
      </Box>
    </Box>
  );
}

export default ChatWindow;
