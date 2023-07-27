import { Card, CardBody, Text } from '@chakra-ui/react';
import React from 'react';
import { Attachment } from '../types';

const AttachmentBox: React.FC<{ attachment: Attachment }> =
  ({attachment}: {attachment:Attachment}) => {
  return (
    <Card>
      <CardBody>
        <Text>{attachment.file_name}</Text>
        <Text>{attachment.file_type}</Text>
        <Text>{attachment.file_size} Bytes</Text>
      </CardBody>
    </Card>
  );
}

export default AttachmentBox;