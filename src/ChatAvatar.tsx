import { Avatar, AvatarProps } from "@chakra-ui/react";
import { uuid2number } from "./utils/hashing";
import './ChatAvatar.css'
import { v4 as uuidv4 } from 'uuid';

export default function ChatAvatar({id, ...props}: AvatarProps & {id?: string}) {
  return (
    <Avatar
      mr={2}
      src={`/avatars/bot${1+uuid2number(id || uuidv4())%8}.webp`}
      objectPosition="top"
      {...props}
    />
  )
}