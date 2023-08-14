import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tag } from "@chakra-ui/react";
import Lines from "../accessories/Lines";

function Prompt({label, children}: {label: string, children: string}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Tag>{label}</Tag>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Prompt</PopoverHeader>
        <PopoverBody>
          <Lines>{children}</Lines>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default Prompt;

