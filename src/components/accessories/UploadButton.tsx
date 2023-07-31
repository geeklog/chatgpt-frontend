import { AttachmentIcon } from '@chakra-ui/icons';
import React, { useRef } from 'react';
import * as api from '../../api/api';
import { Attachment } from '../../types';

type UploadedCallback = (file: Attachment) => void;

const FileUploadButton: React.FC<{onUploaded: UploadedCallback}> = ({onUploaded}: {onUploaded: UploadedCallback}) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current?.files) {
      const file = inputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.upload(formData);
      const attachment = res.file as Attachment;
      attachment.file_type = file.type;
      onUploaded(attachment);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <AttachmentIcon cursor="pointer" boxSize={8}
        onClick={() => inputRef.current?.click()}
      />
    </div>
  );
};

export default FileUploadButton;