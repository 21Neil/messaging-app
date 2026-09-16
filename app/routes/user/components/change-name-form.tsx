import { Button, TextInput } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useSubmit } from 'react-router';
import {
  changeNameSchema,
  type ChangeNameFormValues,
} from '~/services/user-services';

interface ChangeNameFromProps {
  getUser: () => void;
  name: string;
}

const ChangeNameForm = ({ getUser, name }: ChangeNameFromProps) => {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: name,
    },
    validate: schemaResolver(changeNameSchema),
  });

  const handleSubmit = async (values: ChangeNameFormValues) => {
    await submit({ ...values, intent: 'changeName' }, { method: 'patch' });
    getUser();
  };

  useEffect(() => {
    form.setInitialValues({ name: name });
    form.reset();
  }, [name]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        key={form.key('name')}
        {...form.getInputProps('name')}
        label='暱稱'
        mb={8}
      />
      <Button
        type='button'
        px={8}
        disabled={!form.isDirty() || form.submitting}
        onClick={form.reset}
        color='gray'
        mr={4}
      >
        取消
      </Button>
      <Button
        type='submit'
        px={8}
        disabled={!form.isDirty() || form.submitting}
      >
        修改
      </Button>
    </form>
  );
};

export default ChangeNameForm;
