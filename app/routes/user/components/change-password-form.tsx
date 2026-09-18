import { Button, PasswordInput, Title } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useSubmit } from 'react-router';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '~/services/user-services';

const ChangePasswordFrom = () => {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: schemaResolver(changePasswordSchema),
  });

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    await submit({ ...values, intent: 'changePassword' }, { method: 'patch' });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Title order={3}>修改密碼</Title>
      <PasswordInput
        {...form.getInputProps('password')}
        key={form.key('password')}
        label='密碼'
      />
      <PasswordInput
        {...form.getInputProps('newPassword')}
        key={form.key('newPassword')}
        label='新密碼'
      />
      <PasswordInput
        {...form.getInputProps('confirmPassword')}
        key={form.key('confirmPassword')}
        label='確認新密碼'
        mb={8}
      />
      <Button px={8} type='submit'>修改</Button>
    </form>
  );
};

export default ChangePasswordFrom;
