import { Avatar, Box } from '@chakra-ui/react';
import Loading from './components/Loading';
import { Message, MessageStatus, Sender } from './types';
import './MessageBubble.css'
import { RepeatIcon } from '@chakra-ui/icons';
import { uuid2number } from './utils/hashing';
import './Avatar.css'
import MarkdownPreview from './components/MarkdownPreview';
import Lines from './components/Lines';

function ReloadButton(props: any) {
  return <RepeatIcon {...props} />
}

function MessageBubble({msg, handleReloadMessage}: {
  msg: Message,
  handleReloadMessage: (pair: string) => void
}) {
  const isSelf = msg.sender === Sender.User;
  const isError = msg.status === MessageStatus.Error;
  const isBot = msg.sender === Sender.Bot;
  const bg = isError ? "red.500" : (isSelf ? "blue.500" : "gray.50");
  const textColor = isError ? "white": (isSelf ? "white" : "gray.600");
  const justify = isSelf ? "flex-end" : "flex-start";
  let bubbleStyle = {
    display: "inline-block",
    maxWidth: isSelf ? "70%": "calc(100%-7rem)",
    padding: "0.5rem 1rem",
    borderRadius: "1rem",
    backgroundColor: "gray.300",
    cursor: ''
  };
  if (isError) {
    bubbleStyle = {...bubbleStyle, cursor: 'pointer'};
  }

  return (
    <Box w="100%" display="flex" justifyContent={justify} position="relative" >
      {isBot &&
        <Avatar mt={1} mr={2} src={`/avatars/bot${1+uuid2number(msg.sessionID)%8}.webp`} objectPosition="top" />
      }
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
                ? <MarkdownPreview
                    markdown={msg.media === 'image' ? `![](${msg.msg})` : msg.msg}
                  />
                : <Lines>{msg.msg}</Lines>
        }
      </Box>
    </Box>
  );
}

export default MessageBubble;