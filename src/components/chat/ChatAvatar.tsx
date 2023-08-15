import './ChatAvatar.css'
import { Avatar, AvatarProps } from "@chakra-ui/react";
import { useSettings } from "../../states/settings";
import { globalModelConfigs } from '../../states/llm';

export default function ChatAvatar({id, ...props}: AvatarProps & {id?: string}) {
  const settings = useSettings();
  const icon = globalModelConfigs[settings.llm].icon;
  return (
    <Avatar
      mr={2}
      src={`/avatars/${icon}`}
      objectPosition="top"
      {...props}
    />
  )
}