import { Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import authService, {
  loginSchema,
  type LoginFormValues,
} from '~/services/auth-service';
import type { Route } from './+types/login';
import { useSubmit } from 'react-router';
import customNotification from '~/utils/customNotifications';

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  try {
    const formdata = await request.formData();
    const username = formdata.get('username')?.toString();
    const password = formdata.get('password')?.toString();

    if (!username || !password)
      return customNotification.showError('未收到使用者名稱或密碼');

    await authService.login({ username, password });
  } catch (err: any) {
    customNotification.showError(err.message || '未收到使用者名稱或密碼');
  }
};

const Login = () => {
  const submit = useSubmit();

  const form = useForm<LoginFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: schemaResolver(loginSchema, { sync: true }),
  });

  const handleSubmit = (values: LoginFormValues) => {
    submit(values, { method: 'post' });
  };

  return (
    <>
      <div>
        <title>登入</title>
        <meta property='og:title' content='登入' />
        <meta name='description' content='登入' />
      </div>
      <Stack component='main' align='center' justify='center' h='100vh'>
        <Title>Messaging app</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
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
            <Button type='submit'>Login</Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default Login;
