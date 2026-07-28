import { Button } from '@mantine/core';
import { Form } from 'react-router';
import authService from '~/services/auth-service';
import customNotifications from '~/utils/customNotifications';

export const clientAction = async () => {
  try {
    await authService.logout();
  } catch (err: any) {
    customNotifications.showError(err.message || '登出失敗');
  }
};

const Home = () => {
  return (
    <>
      <div>
        <title>聊天室</title>
        <meta property='og:title' content='聊天室' />
        <meta name='description' content='聊天室' />
      </div>
      <main>
        <h1>test</h1>
        <Form method='delete'>
          <Button type='submit'>Logout</Button>
        </Form>
      </main>
    </>
  );
};

export default Home;
