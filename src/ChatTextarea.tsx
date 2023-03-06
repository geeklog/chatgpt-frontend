import { useState } from "react";
import { Textarea } from "@chakra-ui/react";

function ChatTextarea(props: any) {
  const [nLines, setNLines] = props.nLineHook;
  const [value, setValue] = useState("");

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
    if (event.key === 'Enter') {
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
      {...props}
    />
  );
}

export default ChatTextarea;