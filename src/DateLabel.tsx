import { getRelativeTime } from './utils/date';
import { Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useGlobalInterval } from './hooks/useGlobalInterval';

function DateLabel(props: any) {
  const [time, setTime] = useState('');
  useGlobalInterval(() => {
    setTime(getRelativeTime(props.date))
  }, 60000);

  return (
    <Text fontSize="xs" color="gray.400" whiteSpace="nowrap" {...props}>
      {time || getRelativeTime(props.date)}
    </Text>
  )
}

export default DateLabel;