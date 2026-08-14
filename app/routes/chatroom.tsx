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
  ScrollArea,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useOutletContext, useSubmit } from 'react-router';
import ChatMessage from '~/components/chat-message';
import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import { IoSend } from 'react-icons/io5';

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
  const content = formdata.get('content')?.toString();
  const id = +params.id;

  if (!content) return;

  return await chatroomServices.createMessage(id, { content });
};

const Chatroom = ({ loaderData }: Route.ComponentProps) => {
  const roomName =
    loaderData &&
    (loaderData.name ||
      loaderData.members.map(member => member.name).toString());
  const messages = loaderData?.messages || [];
  const context: { user: Member } = useOutletContext();
  const user = context?.user;
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: messageFromValue) => {
    await submit(values, { method: 'post' });
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

    if (user.id === messages[messages.length - 1].senderId) scrollToBottom();
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
      </main>
    </>
  );
};

export default Chatroom;
