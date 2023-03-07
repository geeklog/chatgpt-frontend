import { useState } from "react";
import { Textarea } from "@chakra-ui/react";
import useDeviceDetection from "./hooks/useDeviceDetection";

function ChatTextarea(props: any) {
  const {
    typingHook: [value, setValue],
    nLineHook: [nLines, setNLines],
    ...restProps
  } = props;

  const {isMobile} = useDeviceDetection();

  const handleKeyDown = (event: any) => {
    if (event.shiftKey && event.key === "Enter") {
      event.preventDefault();

      const cursorPosition = event.target.selectionStart;
      const text = event.target.value;
      const newValue = text.substring(0, cursorPosition) + "\n" + text.substring(cursorPosition);
      setValue(newValue);
      setNLines(newValue.split('\n').length);
      event.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
      return;
    }
    if (event.key === 'Enter' && !isMobile) {
      event.preventDefault();
      props.onSubmit?.(value);
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
      onKeyDown={handleKeyDown}
      {...restProps}
    />
  );
}

export default ChatTextarea;