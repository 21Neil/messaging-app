import { Button, Card, Divider, Flex, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import authServices from '~/services/auth-services';
import chatroomServices from '~/services/chatroom-services';
import customNotifications from '~/utils/customNotifications';
import type { Route } from './+types/home';
import { MdAdd } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';
import CreateChatroomModal from '~/routes/home/components/create-chatroom-modal';
import { Fragment } from 'react';

export const clientLoader = async () => {
  const chatrooms = await chatroomServices.getChatrooms();

  return chatrooms.chatroom;
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formdata = await request.formData();
  const intent = formdata.get('intent');

  switch (intent) {
    case 'logout': {
      await authServices.logout();

      break;
    }

    case 'create-chatroom': {
      const name = formdata.get('name')?.toString();
      const rawMembers = formdata.get('members')?.toString();

      if (!rawMembers) return customNotifications.showError('最少邀請一名成員');

      const members = rawMembers.split(',');

      await chatroomServices.createChatroom({ name, members });
      customNotifications.showSuccess('創建成功');

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
      <>
        <title>聊天室</title>
        <meta property='og:title' content='聊天室' />
        <meta name='description' content='聊天室' />
      </>
      <main>
        <Flex py={18} px={18} align='center' justify='space-between'>
          <Title size={24}>聊天室</Title>
          <Button
            variant='transparent'
            color='black'
            fz={20}
            onClick={open}
            px='xs'
          >
            <MdAdd />
          </Button>
        </Flex>
        {/* <Form method='delete'>
          <Button type='submit' name='intent' value='logout'>
            Logout
          </Button>
        </Form> */}
        {loaderData &&
          loaderData.map(item => (
            <Fragment key={item.id}>
              <Card shadow='xs' mx={8} key={item.id}>
                <Link to={`/chatroom/${item.id}`}>
                  <Flex justify='space-between' py={8}>
                    <Title order={2} size={18}>
                      {item.name || item.members.map(member => member.name)}
                    </Title>
                    <Text>{item.members.length + 1}人</Text>
                  </Flex>
                </Link>
              </Card>
              <Divider my={10} mx={16} />
            </Fragment>
          ))}

        <CreateChatroomModal {...{ opened }} onClose={close} />
      </main>
    </>
  );
};

export default Home;
