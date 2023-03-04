import { Box } from '@chakra-ui/react';
import Loading from './components/Loading';
import { Message, MessageStatus, Sender } from './types';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import './MessageBubble.css'
import { RepeatIcon } from '@chakra-ui/icons';

function ReloadButton(props: any) {
  return <RepeatIcon {...props} />
}

function BubbleMessage({msg, handleReloadMessage}: {
  msg: Message,
  handleReloadMessage: (pair: string) => void
}) {
  const isSelf = msg.sender === Sender.User;
  const isError = msg.status === MessageStatus.Error;
  const bg = isError ? "red.500" : (isSelf ? "blue.500" : "gray.500");
  const textColor = isSelf ? "white" : "gray.50";
  const justify = isSelf ? "flex-end" : "flex-start";
  let bubbleStyle = {
    display: "inline-block",
    maxWidth: "calc(100%-5rem)",
    padding: "0.5rem 1rem",
    borderRadius: "1rem",
    backgroundColor: "gray.300",
    cursor: ''
  };
  if (isError) {
    bubbleStyle = {...bubbleStyle, cursor: 'pointer'};
  }

  return (
    <Box w="100%" display="flex" justifyContent={justify} mb={3}>
      <Box
        backgroundColor={bg}
        color={textColor}
        style={bubbleStyle}
        onClick={() => {
          if (isError) {
            handleReloadMessage(msg.pair)
          }
        }}
      >
        { msg.status === MessageStatus.Pending
            ? <Loading style={{height: '24px'}}/>
            : isError
              ? <>{msg.msg} <ReloadButton/></>
              : msg.sender === Sender.Bot && msg.status == MessageStatus.Normal
                ? <ReactMarkdown components={ChakraUIRenderer()} children={msg.msg} skipHtml />
                : <div>{msg.msg}</div>
        }
      </Box>
    </Box>
  );
}

export default BubbleMessage;