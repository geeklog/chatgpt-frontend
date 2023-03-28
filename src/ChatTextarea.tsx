import { Textarea, TextareaProps } from "@chakra-ui/react";
import useDeviceDetection from "./hooks/useDeviceDetection";

type SendMessageHandler = (startNewSession: boolean) => Promise<void>;

function ChatTextarea(props: TextareaProps & {typingHook: any, nLineHook: any, onSendMessage: SendMessageHandler}) {
  const {
    typingHook: [value, setValue],
    nLineHook: [nLines, setNLines],
    onSendMessage,
    ...restProps
  } = props;

  const {isMobile} = useDeviceDetection();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.shiftKey && event.key === "Enter") {
      return;
    }
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onSendMessage(true);
      setValue('');
      setNLines(1);
      return;
    }
    if (event.key === 'Enter' && !isMobile) {
      event.preventDefault();
      onSendMessage(false);
      setValue('');
      setNLines(1);
      return;
    }
  };

  const handleChange = (event: any) => {
    setValue(event.target.value);
    setNLines(event.target.value.split('\n').length);
  };

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown as any}
      {...restProps}
    />
  );
}

export default ChatTextarea;