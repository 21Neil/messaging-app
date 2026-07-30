import {
  Button,
  Group,
  Modal,
  PillsInput,
  Stack,
  TagsInput,
  TextInput,
  type ModalProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import {
  createChatroomSchema,
  type createChatroomFormValues,
} from '~/services/chatroom-services';
import type { Route } from '../routes/+types/home';
import { useSubmit } from 'react-router';

export const clientAction = async ({ request }: Route.ClientActionArgs) => {};

const CreateChatroomModal = ({ opened, onClose }: ModalProps) => {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      members: [],
    },
    validate: schemaResolver(createChatroomSchema),
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleSubmit = (values: createChatroomFormValues) => {
    submit({ ...values, intent: 'create-chatroom' }, { method: 'post' });
    onClose();
    form.reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title='創建聊天室'
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            key={form.key('name')}
            {...form.getInputProps('name')}
            label='名稱'
          />
          <TagsInput
            label='成員'
            placeholder='請輸入使用者名稱'
            key={form.key('members')}
            {...form.getInputProps('members')}
          />
          <Group justify='end'>
            <Button type='button' color='gray' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit'>Create</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateChatroomModal;
