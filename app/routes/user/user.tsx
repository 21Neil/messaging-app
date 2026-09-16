import {
  Flex,
  Stack,
  Title,
} from '@mantine/core';
import { useNavigate, useOutletContext } from 'react-router';
import BackButton from '~/components/back-button';
import type { Member } from '~/services/chatroom-services';
import type { Route } from './+types/user';
import customNotifications from '~/utils/customNotifications';
import AvatarForm from './components/avatar-form';
import userServices from '~/services/user-services';
import ChangeNameForm from './components/change-name-form';

export const clientAction = async ({
  request,
  params,
}: Route.ClientActionArgs) => {
  const formdata = await request.formData();
  const intent = formdata.get('intent');
  const id = +params.id;

  switch (intent) {
    case 'changeName': {
      const name = formdata.get('name')?.toString();

      if (!name) break;

      const res = await userServices.changeName(id, { name });

      if (res) customNotifications.showSuccess('修改成功');
    }
    case 'changeAvatar': {
      const avatar = (formdata.get('avatar') as File) || null;
      const oldAvatarUrl = formdata.get('oldAvatarUrl')?.toString() || '';
      const body = new FormData();

      body.append('avatar', avatar);
      body.append('oldAvatarUrl', oldAvatarUrl)

      const res = await userServices.changeAvatar(id, body);

      if (res) customNotifications.showSuccess('修改成功');
    }
  }
};

const User = () => {
  const { user, getUser }: { user: Member; getUser: () => void } =
    useOutletContext() || {};
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <>
        <title>{user?.name}</title>
        <meta property='title:og' content={user?.name} />
        <meta name='description' content='修改使用者資料' />
      </>
      <main>
        <Flex py='sm' align='center'>
          <BackButton onClick={handleBack} />
          <Title size={24}>修改使用者資料</Title>
        </Flex>
        <Stack px={16}>
          <AvatarForm {...{ getUser }} avatarUrl={user?.avatar} />
          <ChangeNameForm {...{ getUser }} name={user?.name} />
        </Stack>
      </main>
    </>
  );
};

export default User;
