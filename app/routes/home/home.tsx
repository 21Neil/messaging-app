import { Button, Card, Divider, Flex, Menu, Text, Title } from '@mantine/core';
import { Link, useOutletContext, useSubmit } from 'react-router';
import authServices from '~/services/auth-services';
import chatroomServices, { type Member } from '~/services/chatroom-services';
import customNotifications from '~/utils/customNotifications';
import type { Route } from './+types/home';
import { MdAdd } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';
import CreateChatroomModal from '~/routes/home/components/create-chatroom-modal';
import { Fragment } from 'react';
import chatroomUtils from '~/utils/chatroom';
import { IoMdMore } from 'react-icons/io';
import ConfirmModal from '~/components/confirm-modal';

export const clientLoader = async () => {
  const chatrooms = await chatroomServices.getChatrooms();

  return chatrooms.chatroom;
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formdata = await request.formData();
  const intent = formdata.get('intent');

  switch (intent) {
    case 'logout': {
      const res = await authServices.logout();

      if (res) customNotifications.showSuccess('登出成功')

      break;
    }

    case 'create-chatroom': {
      const name = formdata.get('name')?.toString();
      const rawMembers = formdata.get('members')?.toString();

      if (!rawMembers) return customNotifications.showError('最少邀請一名成員');

      const members = rawMembers.split(',');

      const res = await chatroomServices.createChatroom({ name, members });

      if (res) customNotifications.showSuccess('創建成功');

      break;
    }

    default:
      customNotifications.showError('未知的操作類型');
  }
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const [confirmModalOpened, confirmModalHandler] = useDisclosure(false);
  const [createModalOpened, createModalHandler] = useDisclosure(false);
  const { user }: { user: Member } = useOutletContext() || {};
  const submit = useSubmit();

  const handleLogout = async () => {
    await submit({ intent: 'logout' }, { method: 'delete' })
  }

  return (
    <>
      <>
        <title>聊天室</title>
        <meta property='og:title' content='聊天室' />
        <meta name='description' content='聊天室' />
      </>
      <main>
        <Flex py={18} px={18} align='center' justify='space-between'>
          <Title size={24}>聊天室</Title>
          <Menu>
            <Menu.Target>
              <Button
                variant='transparent'
                color='black'
                fz={20}
                px='xs'
              >
                <IoMdMore />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={createModalHandler.open}>創建聊天室</Menu.Item>
              <Menu.Item c='red' onClick={confirmModalHandler.open}>登出</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        {loaderData &&
          loaderData.map(item => (
            <Fragment key={item.id}>
              <Card shadow='xs' mx={8} key={item.id}>
                <Link to={`/chatroom/${item.id}`}>
                  <Flex justify='space-between' py={8}>
                    <Title order={2} size={18}>
                      {item.name || chatroomUtils.getRoomName(item.members, user?.id)}
                    </Title>
                    <Text>{item.members.length}人</Text>
                  </Flex>
                </Link>
              </Card>
              <Divider my={10} mx={16} />
            </Fragment>
          ))}

        <ConfirmModal
          opened={confirmModalOpened}
          onClose={confirmModalHandler.close}
          title='確認登出'
          onConfirm={handleLogout}
        />
        <CreateChatroomModal opened={createModalOpened} onClose={createModalHandler.close} />
      </main>
    </>
  );
};

export default Home;
