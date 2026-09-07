import { Button, Flex, Stack, TextInput, Title } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useNavigate, useOutletContext, useSubmit } from 'react-router';
import BackButton from '~/components/back-button';
import type { Member } from '~/services/chatroom-services';
import userServices, {
  changeNameSchema,
  type changeNameFormValues,
} from '~/services/user-services';
import type { Route } from './+types/user';
import customNotifications from '~/utils/customNotifications';
import { useEffect } from 'react';

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
  }
};

const User = () => {
  const { user, getUser }: { user: Member, getUser: () => void } = useOutletContext() || {};
  const navigate = useNavigate();
  const submit = useSubmit();
  const changeNameForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: user?.name,
    },
    validate: schemaResolver(changeNameSchema),
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangeNameSubmit = async (values: changeNameFormValues) => {
    await submit({ ...values, intent: 'changeName' }, { method: 'post' });
    getUser();
  };

  useEffect(() => {
    changeNameForm.setInitialValues({ name: user?.name });
    changeNameForm.reset();
  }, [user?.name]);

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
          <form onSubmit={changeNameForm.onSubmit(handleChangeNameSubmit)}>
            <TextInput
              key={changeNameForm.key('name')}
              {...changeNameForm.getInputProps('name')}
              label='暱稱'
              mb={8}
            />
            <Button
              type='button'
              px={8}
              disabled={!changeNameForm.isDirty()}
              onClick={changeNameForm.reset}
              color='gray'
              mr={4}
            >
              取消
            </Button>
            <Button type='submit' px={8} disabled={!changeNameForm.isDirty()}>
              修改
            </Button>
          </form>
        </Stack>
      </main>
    </>
  );
};

export default User;
