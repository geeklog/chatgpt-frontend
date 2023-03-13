import { Button, ButtonProps } from '@chakra-ui/react';
import { useState } from 'react';

function FadedButton({delay, on, off, onClick, ...props}: ButtonProps & {on: any, off: any, delay: number}) {
  const [state, setState] = useState(false);
  return (
    <Button {...props}
      onClick={(e: any) => {
        setState(true);
        setTimeout(() => setState(false), delay);
        onClick?.(e);
      }}
    >
      {state ? on : off}
    </Button>
  )
}

export default FadedButton;