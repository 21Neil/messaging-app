import { Card, Divider, Flex, Menu, Text, Title } from '@mantine/core';
import { Link, useNavigate, useOutletContext, useSubmit } from 'react-router';
import authServices from '~/services/auth-services';
import chatroomServices, { type Member } from '~/services/chatroom-services';
import customNotifications from '~/utils/customNotifications';
import type { Route } from './+types/home';
import { useDisclosure } from '@mantine/hooks';
import CreateChatroomModal from '~/routes/home/components/create-chatroom-modal';
import { Fragment } from 'react';
import chatroomUtils from '~/utils/chatroom';
import ConfirmModal from '~/components/confirm-modal';
import BasicButton from '~/components/basic-button';
import { MdPeopleOutline } from 'react-icons/md';
import { IoMdMore } from 'react-icons/io';
import AddFriendModal from './components/add-friend-modal';
import friendServices from '~/services/friend-services';

export const clientLoader = async () => {
  const chatrooms = await chatroomServices.getChatrooms();

  return chatrooms?.chatroom;
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formdata = await request.formData();
  const intent = formdata.get('intent');

  switch (intent) {
    case 'logout': {
      const res = await authServices.logout();

      if (res) customNotifications.showSuccess('登出成功');

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

    case 'add-friend': {
      const username = formdata.get('username')?.toString();

      if (!username) return customNotifications.showError('請輸入使用者名稱');

      const res = await friendServices.addFriend({ username });

      if (res) customNotifications.showSuccess('已送出邀請');

      break;
    }

    default:
      customNotifications.showError('未知的操作類型');
  }
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const [confirmModalOpened, confirmModalHandler] = useDisclosure(false);
  const [createModalOpened, createModalHandler] = useDisclosure(false);
  const [addFriendModalOpened, addFriendModalHandler] = useDisclosure(false);
  const { user }: { user: Member } = useOutletContext() || {};
  const submit = useSubmit();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await submit({ intent: 'logout' }, { method: 'delete' });
  };

  return (
    <>
      <>
        <title>聊天室</title>
        <meta property='og:title' content='聊天室' />
        <meta name='description' content='聊天室' />
      </>
      <main>
        <Flex p={18} align='center' justify='space-between'>
          <Title size={24} mr='auto'>
            聊天室
          </Title>
          <Menu>
            <Menu.Target>
              <BasicButton>
                <MdPeopleOutline />
              </BasicButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={addFriendModalHandler.open}>
                新增好友
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu>
            <Menu.Target>
              <BasicButton>
                <IoMdMore />
              </BasicButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={createModalHandler.open}>
                創建聊天室
              </Menu.Item>
              <Menu.Item onClick={() => navigate(`/users/${user.id}`)}>
                修改使用者資料
              </Menu.Item>
              <Menu.Item c='red' onClick={confirmModalHandler.open}>
                登出
              </Menu.Item>
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
                      {item.name ||
                        chatroomUtils.getRoomName(item.members, user?.id)}
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
        <CreateChatroomModal
          opened={createModalOpened}
          onClose={createModalHandler.close}
        />
        <AddFriendModal
          opened={addFriendModalOpened}
          onClose={addFriendModalHandler.close}
        />
      </main>
    </>
  );
};

export default Home;
