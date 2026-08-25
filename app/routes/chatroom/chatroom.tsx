import chatroomServices, {
  type Member,
  type messageFromValue,
} from '~/services/chatroom-services';
import type { Route } from './+types/chatroom';
import {
  Badge,
  Button,
  Divider,
  Flex,
  Menu,
  ScrollArea,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { IoIosArrowBack, IoMdMore } from 'react-icons/io';
import { useNavigate, useOutletContext, useSubmit } from 'react-router';
import ChatMessage from '~/routes/chatroom/components/chat-message';
import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import { IoSend } from 'react-icons/io5';
import { useDisclosure } from '@mantine/hooks';
import ChangeChatroomNameModal from '~/routes/chatroom/components/change-chatroom-name-modal';
import customNotifications from '~/utils/customNotifications';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const id = +params.id;
  const chatroom = await chatroomServices.getChatroom(id);

  return chatroom.chatroom;
};

export const clientAction = async ({
  request,
  params,
}: Route.ClientActionArgs) => {
  const formdata = await request.formData();
  const intent = formdata.get('intent');
  const id = +params.id;

  switch (intent) {
    case 'send-message': {
      const content = formdata.get('content')?.toString();

      if (!content) break;

      await chatroomServices.createMessage(id, { content });

      break;
    }
    case 'change-name': {
      const name = formdata.get('name')?.toString();

      await chatroomServices.chagneChatroomName(id, { name });

      break;
    }

    default:
      customNotifications.showError('未知的操作類型');
  }
};

const Chatroom = ({ loaderData }: Route.ComponentProps) => {
  const roomData = loaderData;
  const { user }: { user: Member } = useOutletContext() || {};
  const roomName =
    roomData?.name ||
    roomData?.members?.find(member => member.id !== user?.id)?.name;
  const messages = loaderData?.messages || [];
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      content: '',
    },
  });
  const navigate = useNavigate();
  const submit = useSubmit();
  const viewport = useRef<HTMLDivElement>(null);
  const firstEnter = useRef<boolean>(true);
  const [changeOpened, changeHandlers] = useDisclosure(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = () => {
    changeHandlers.open();
  };

  const handleDelete = () => {};

  const handleSubmit = async (values: messageFromValue) => {
    await submit({ ...values, intent: 'send-message' }, { method: 'post' });
    form.reset();
  };

  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight });

  useEffect(() => {
    if (!user) return;

    if (firstEnter.current) {
      scrollToBottom();
      firstEnter.current = false;
    }

    if (
      messages.length > 0 &&
      user.id === messages[messages.length - 1].senderId
    )
      scrollToBottom();
  }, [user, messages]);

  return (
    <>
      <>
        <title>{roomName}</title>
        <meta name='og:title' content={roomName} />
        <meta name='description' content={roomName} />
      </>
      <main>
        <Stack gap={0}>
          <Flex align='center' py='sm'>
            <Button
              variant='transparent'
              color='black'
              fz={20}
              px='xs'
              onClick={handleBack}
            >
              <IoIosArrowBack />
            </Button>
            <Title size={24}>{roomName}</Title>
            <Menu>
              <Menu.Target>
                <Button
                  ml='auto'
                  variant='transparent'
                  color='black'
                  fz={20}
                  px='xs'
                >
                  <IoMdMore />
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={handleChange}>變更聊天室名稱</Menu.Item>
                <Menu.Item c='red' onClick={handleDelete}>
                  刪除聊天室
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
          <Divider />
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
                prevDay &&
                prevDay.format('YYYYMMDD') === currDay.format('YYYYMMDD');

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
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex px={12} pb={6}>
              <TextInput
                w='100%'
                radius='xl'
                key={form.key('content')}
                {...form.getInputProps('content')}
              />
              <Button
                type='submit'
                fz={16}
                variant='transparent'
                p={8}
                pos='absolute'
                right={16}
              >
                <IoSend />
              </Button>
            </Flex>
          </form>
        </Stack>
        <ChangeChatroomNameModal
          opened={changeOpened}
          onClose={changeHandlers.close}
          members={roomData && roomData.members}
          name={roomData.name}
        />
      </main>
    </>
  );
};

export default Chatroom;
