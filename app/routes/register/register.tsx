import { Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useNavigate, useSubmit } from 'react-router';
import authServices, {
  registerSchema,
  type RegisterFormValues,
} from '~/services/auth-services';
import type { Route } from './+types/register';
import customNotifications from '~/utils/customNotifications';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie');

  if (cookieHeader) authServices.logout();
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formdata = await request.formData();
  const username = formdata.get('username')?.toString();
  const password = formdata.get('password')?.toString();
  const name = formdata.get('name')?.toString();

  if (!username || !password)
    return customNotifications.showError('未收到使用者名稱或密碼');
  if (!name) return customNotifications.showError('未收到暱稱');

  await authServices.register({ name, username, password });
};

const Register = () => {
  const submit = useSubmit();
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: schemaResolver(registerSchema, { sync: true }),
  });

  const handleSubmit = (values: RegisterFormValues) => {
    submit(values, { method: 'post' });
  };

  return (
    <>
      <>
        <title>註冊</title>
        <meta property='og:title' content='註冊' />
        <meta name='description' content='註冊' />
      </>
      <Stack component='main' h='100vh' justify='center' align='center'>
        <Title>Messaging app</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              key={form.key('name')}
              {...form.getInputProps('name')}
              label='Name'
            />
            <TextInput
              key={form.key('username')}
              {...form.getInputProps('username')}
              label='Username'
            />
            <PasswordInput
              key={form.key('password')}
              {...form.getInputProps('password')}
              label='Password'
            />
            <PasswordInput
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
              label='Confirm password'
            />
            <Button type='submit'>註冊</Button>
            <Button type='button' color='gray' onClick={() => navigate(-1)}>
              返回
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default Register;
