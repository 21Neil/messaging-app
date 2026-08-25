import { Avatar, Flex, ScrollArea, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import type { Message } from '~/services/chatroom-services';

const ChatMessage = ({
  userId,
  message,
}: {
  userId: number;
  message: Message;
}) => {
  const isUser = userId === message.senderId;
  const time = dayjs(message.createAt).format('h:mm A')

  return (
    <Flex
      key={message.id}
      align='start'
      gap={6}
      direction={isUser ? 'row-reverse' : 'row'}
      my={6}
    >
      <Avatar
        src={message.sender.avatar}
        alt='avatar'
        size={'md'}
        color='gray.3'
      />
      <Stack gap={0} align={isUser ?  'end': 'start'}>
        <Text fz={11}>{message.sender.name}</Text>
        <Flex direction={isUser ? 'row-reverse' : 'row'} gap={4}>
          <Text bg={isUser ? 'blue.1' : 'gray.3'} px={10} py={2} bdrs={10}>
            {message.content}
          </Text>
          <Text fz={9} style={{ alignSelf: 'end' }}>{time}</Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default ChatMessage;
