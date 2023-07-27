import { Box, Button, HStack } from '@chakra-ui/react';
import Loading from './components/Loading';
import { Message, MessageStatus, Sender, MessageMedia } from './types';
import './MessageBubble.css'
import { RepeatIcon } from '@chakra-ui/icons';
import MarkdownPreview from './components/MarkdownPreview';
import Lines from './components/Lines';
import DateLabel from './DateLabel';
import ChatAvatar from './ChatAvatar';
import AttachmentBox from './components/AttachmentBox';

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
  const bg = isError ? "red.500" : msg.media === 'file' ? 'none' : (isSelf ? "blue.500" : "gray.50");
  const showTimeLabel = msg.media !== 'file';
  const textColor = isError ? "white": (isSelf ? "white" : "gray.600");
  const justify = isSelf ? "flex-end" : "flex-start";
  let bubbleStyle = {
    display: "inline-block",
    maxWidth: isSelf ? "70%": "calc(100%-7rem)",
    padding: "0.8rem 1rem",
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
        <ChatAvatar id={msg.sessionID}/>
      }
      <Box
        backgroundColor={bg}
        color={textColor}
        style={bubbleStyle}
        mt={5}
        pos="relative"
        onClick={() => {
          if (isError) {
            handleReloadMessage(msg.pair)
          }
        }}
      >
        {showTimeLabel && <DateLabel date={msg.time} pos="absolute" top={-6} {...(isSelf ? {right: 3}: {left: 3})}/>}
        { msg.status === MessageStatus.Pending
            ? <Loading style={{height: '24px'}}/>
            : isError
              ? <>{msg.msg} <ReloadButton/></>
              : msg.sender === Sender.Bot && msg.status === MessageStatus.Normal
                ? <>
                    <MarkdownPreview
                      markdown={msg.media === 'image' ? `![](${msg.msg})` : msg.msg}
                    />
                    {/* <Button
                      pos="absolute"
                      size={"sm"}
                      variant="solid"
                      bgColor="green.500"
                      bottom="-2.2rem"
                      color="white">
                        Continue
                    </Button> */}
                  </>
                : <Lines>{msg.msg}</Lines>
        }
        {msg.attachments && msg.attachments.length > 0 &&
          <HStack>
            {msg.attachments.map((attachment, i) => <AttachmentBox key={i} attachment={attachment} />)}
          </HStack>
        }
      </Box>
    </Box>
  );
}

export default MessageBubble;