import { Button, Group, Stack, TextInput } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useSubmit } from 'react-router';
import BasicModal from '~/components/basic-modal';
import {
  addFriendSchema,
  type AddFriendFormValues,
} from '~/services/friend-services';

interface AddFriendModalProps {
  opened: boolean;
  onClose: () => void;
}

const AddFriendModal = ({ opened, onClose }: AddFriendModalProps) => {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
    },
    validate: schemaResolver(addFriendSchema),
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleSubmit = (values: AddFriendFormValues) => {
    submit({ ...values, intent: 'add-friend' }, { method: 'post' });
    onClose();
    form.reset();
  };

  return (
    <BasicModal opened={opened} onClose={onClose} title='新增好友'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            {...form.getInputProps('username')}
            key={form.key('username')}
            label='使用者名稱'
          />
          <Group justify='end'>
            <Button type='button' color='gray' onClick={handleClose}>
              取消
            </Button>
            <Button type='submit'>新增</Button>
          </Group>
        </Stack>
      </form>
    </BasicModal>
  );
};

export default AddFriendModal;
