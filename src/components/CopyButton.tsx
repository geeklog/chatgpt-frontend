import { Button } from '@chakra-ui/react';
import { useState } from 'react';

function CopyButton({text}: {text: string}) {
  const [state, setState] = useState(false);
  return (
    <Button size='s' opacity={0.5} px={2} py={1} pos='absolute' right={2} top={2}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setState(true);
        setTimeout(() => setState(false), 1000);
      }}
    >
      {state ? 'COPIED': 'COPY'}
    </Button>
  )
}

export default CopyButton;