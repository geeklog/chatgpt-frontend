import { Box, Text, HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import { Attachment } from '../../types';
import { parseMimeType } from '../../utils/filetype';

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

const AttachmentBox: React.FC<{ attachment: Attachment }> =
  ({attachment}: {attachment:Attachment}) => {
  const fileType = parseMimeType(attachment.file_type);
  return (
    <Box w={40} h={12} p={0} borderRadius={6} shadow="md">
      <HStack bg='blue.200' borderRadius={6} w="100%">
        <VStack pl={2} w={20}>
          <Text fontSize='md' color='white' fontWeight='bold'>{fileType}</Text>
        </VStack>
        <VStack
          bg='white'
          px={2} py={1} spacing={1}
          borderTopRightRadius={6} borderBottomRightRadius={6}
          w="100%"
          align="flex-start"
        >
          <Text fontSize='xs' color='black' noOfLines={1}>{attachment.file_name}</Text>
          <Text fontSize='sm' color='black'>{bytesToSize(attachment.file_size)}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export default AttachmentBox;