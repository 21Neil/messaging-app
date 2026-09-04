import chatroomServices, { type Member } from '~/services/chatroom-services';
import type { Route } from './+types/chatroom';
import { Stack } from '@mantine/core';
import { useNavigate, useOutletContext } from 'react-router';
import { useEffect, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import ChangeModal from '~/routes/chatroom/components/change-modal';
import customNotifications from '~/utils/customNotifications';
import Header from './components/header';
import ChatArea from './components/chat-area';
import ChatInput from './components/chat-input';
import ConfirmModal from '../../components/confirm-modal';
import JoinModal from './components/join-modal';
import chatroomUtils from '~/utils/chatroom';
import MembersModal from './components/members-modal';

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
    case 'join': {
      const rawUsernames = formdata.get('usernames')?.toString();

      if (!rawUsernames) break;

      const usernames = rawUsernames.split(',');
      const res = await chatroomServices.joinChatroom(id, { usernames });

      if (res) customNotifications.showSuccess('邀請成功！')

      break;
    }
    case 'change-name': {
      const name = formdata.get('name')?.toString();
      const res = await chatroomServices.changeChatroomName(id, { name });

      if (res) customNotifications.showSuccess('更改成功！')

      break;
    }

    default:
      customNotifications.showError('未知的操作類型');
  }
};

const Chatroom = ({ loaderData }: Route.ComponentProps) => {
  const roomData = loaderData;
  const { user }: { user: Member } = useOutletContext() || {};
  const roomName = roomData?.name || chatroomUtils.getRoomName(roomData?.members, user?.id);
  const hasRoomName = !!roomData?.name;
  const messages = loaderData?.messages || [];
  const viewport = useRef<HTMLDivElement>(null);
  const firstEnter = useRef<boolean>(true);

  const [membersModalOpened, membersModalHandlers] = useDisclosure(false);
  const [joinModalOpened, joinModalHandlers] = useDisclosure(false);
  const [changeModalOpened, changeModalHandlers] = useDisclosure(false);
  const [leaveConfirmModalOpened, leaveConfirmModalHandlers] = useDisclosure(false);
  const [deleteConfirmModalOpened, deleteConfirmModalHandlers] = useDisclosure(false);

  const navigate = useNavigate();

  const onLeaveConfirm = async () => {
    const res = await chatroomServices.leaveChatroom(roomData.id);

    if (res) navigate(-1);
  };

  const onDeleteConfirm = async () => {
    const res = await chatroomServices.deleteChatroom(roomData.id);

    if (res) navigate(-1);
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
          <Header
            roomName={roomName}
            handleMembers={membersModalHandlers.open}
            handleJoin={joinModalHandlers.open}
            handleChange={changeModalHandlers.open}
            handleLeave={leaveConfirmModalHandlers.open}
            handleDelete={deleteConfirmModalHandlers.open}
          />
          <ChatArea messages={messages} viewport={viewport} user={user} />
          <ChatInput />
        </Stack>

        <MembersModal 
          opened={membersModalOpened}
          onClose={membersModalHandlers.close}
          members={roomData.members}
        />
        <JoinModal
          opened={joinModalOpened}
          onClose={joinModalHandlers.close}
          hasRoomName={hasRoomName}
        />
        <ChangeModal
          opened={changeModalOpened}
          onClose={changeModalHandlers.close}
          members={roomData && roomData.members}
          name={roomData.name}
        />
        <ConfirmModal
          opened={leaveConfirmModalOpened}
          onClose={leaveConfirmModalHandlers.close}
          title='離開聊天室'
          onConfirm={onLeaveConfirm}
        />
        <ConfirmModal
          opened={deleteConfirmModalOpened}
          onClose={deleteConfirmModalHandlers.close}
          title='刪除聊天室'
          onConfirm={onDeleteConfirm}
        />
      </main>
    </>
  );
};

export default Chatroom;
