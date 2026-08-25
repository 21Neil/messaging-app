import { Badge, ScrollArea } from "@mantine/core";
import dayjs from "dayjs";
import { Fragment } from "react/jsx-runtime";
import type { Member, Message } from "~/services/chatroom-services";
import ChatMessage from "./chat-message";

interface ChatAreaProps {
  messages: Message[];
  viewport: React.RefObject<HTMLDivElement | null>;
  user: Member;
}

const ChatArea = ({ messages, viewport, user }: ChatAreaProps) => {

  return (
    <ScrollArea
      viewportRef={viewport}
      h='calc(100vh - 60px - 1px - 42px)'
      px={6}
      scrollbarSize={6}
    >
      {messages.map((message, i) => {
        const prevDay = i > 0 ? dayjs(messages[i - 1].createAt) : null;
        const currDay = dayjs(message.createAt);
        const isSameDay =
          prevDay && prevDay.format('YYYYMMDD') === currDay.format('YYYYMMDD');

        return (
          <Fragment key={message.id}>
            {(!isSameDay || i === 0) && (
              <Badge
                variant='outline'
                mx='auto'
                my={6}
                color='dark.3'
                display='block'
              >
                {currDay.format('YYYY/M/D')}
              </Badge>
            )}
            {user && <ChatMessage {...{ message }} userId={user.id} />}
          </Fragment>
        );
      })}
    </ScrollArea>
  );
};

export default ChatArea;
