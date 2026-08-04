import {
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Form, Link, useSubmit } from 'react-router';
import authServices from '~/services/auth-services';
import chatroomServices from '~/services/chatroom-services';
import customNotifications from '~/utils/customNotifications';
import type { Route } from './+types/home';
import { MdAdd } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';
import CreateChatroomModal from '~/components/create-chatroom-modal';

interface Chatroom {
  id: number;
  name: string;
  members: Member[];
}

interface Member {
  id: number;
  avatar: string;
  name: string;
}

export const clientLoader = async () => {
  try {
    const chatrooms = await chatroomServices.getChatrooms();

    return chatrooms.chatroom;
  } catch (err: any) {
    customNotifications.showError(err.message || '獲取聊天室失敗');
    console.error(err);
  }
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formdata = await request.formData();
  const intent = formdata.get('intent');

  switch (intent) {
    case 'logout': {
      try {
        await authServices.logout();
      } catch (err: any) {
        customNotifications.showError(err.message || '登出失敗');
      }

      break;
    }

    case 'create-chatroom': {
      const name = formdata.get('name')?.toString();
      const rawMembers = formdata.get('members')?.toString();

      if (!rawMembers) return customNotifications.showError('最少邀請一名成員');

      const members = rawMembers.split(',');

      try {
        await chatroomServices.createChatroom({ name, members });
        customNotifications.showSuccess('創建成功');
      } catch (err: any) {
        customNotifications.showError(err.message || '創建失敗');
      }

      break;
    }

    default:
      customNotifications.showError('未知的操作類型');
  }
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div>
        <title>聊天室</title>
        <meta property='og:title' content='聊天室' />
        <meta name='description' content='聊天室' />
      </div>
      <main>
        <Flex py={18} px={18} align='center' justify='space-between'>
          <Title size={24}>聊天室</Title>
          <Button variant='transparent' color='black' fz={20} onClick={open} px='xs'>
            <MdAdd />
          </Button>
        </Flex>
        {/* <Form method='delete'>
          <Button type='submit' name='intent' value='logout'>
            Logout
          </Button>
        </Form> */}
        {loaderData.map((item: Chatroom) => (
          <>
            <Card shadow='xs' mx={8}>
              <Link to={`/chatrooms/${item.id}`} key={item.id}>
                <Flex justify='space-between' py={8}>
                  <Title order={2} size={18}>
                    {item.name ||
                      '與' +
                        item.members.map(member => member.name) +
                        '的聊天'}
                  </Title>
                  <Text>{item.members.length + 1}人</Text>
                </Flex>
              </Link>
            </Card>
            <Divider my={12} mx={16} />
          </>
        ))}

        <CreateChatroomModal {...{ opened }} onClose={close} />
      </main>
    </>
  );
};

export default Home;
