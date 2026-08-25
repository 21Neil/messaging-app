import chatroomServices, { type Member } from '~/services/chatroom-services';
import type { Route } from './+types/chatroom';
import { Stack } from '@mantine/core';
import { useOutletContext, useSubmit } from 'react-router';
import { useEffect, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import ChangeChatroomNameModal from '~/routes/chatroom/components/change-chatroom-name-modal';
import customNotifications from '~/utils/customNotifications';
import Header from './components/header';
import ChatArea from './components/chat-area';
import ChatInput from './components/chat-input';
import DeleteChatroomConfirmModal from './components/delete-chatroom-confirm-modal';

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

      await chatroomServices.changeChatroomName(id, { name });

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
    roomData?.members?.find(member => member.id !== user?.id)?.name ||
    '未成功取得名稱';
  const messages = loaderData?.messages || [];
  const viewport = useRef<HTMLDivElement>(null);
  const firstEnter = useRef<boolean>(true);
  const [changeOpened, changeHandlers] = useDisclosure(false);
  const [deleteConfirmOpened, deleteConfirmHandlers] = useDisclosure(false);

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
          <Header
            roomName={roomName}
            handleChange={changeHandlers.open}
            handleDelete={deleteConfirmHandlers.open}
          />
          <ChatArea messages={messages} viewport={viewport} user={user} />
          <ChatInput />
        </Stack>
        <ChangeChatroomNameModal
          opened={changeOpened}
          onClose={changeHandlers.close}
          members={roomData && roomData.members}
          name={roomData.name}
        />
        <DeleteChatroomConfirmModal
          opened={deleteConfirmOpened}
          onClose={deleteConfirmHandlers.close}
          roomId={roomData.id}
        />
      </main>
    </>
  );
};

export default Chatroom;
