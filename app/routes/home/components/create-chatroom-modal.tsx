import {
  Button,
  Group,
  Stack,
  TagsInput,
  TextInput,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import {
  createChatroomSchema,
  type CreateChatroomFormValues,
} from '~/services/chatroom-services';
import { useSubmit } from 'react-router';
import BasicModal from '~/components/basic-modal';

interface CreateChatroomModalProps {
  opened: boolean;
  onClose: () => void;
}

const CreateChatroomModal = ({ opened, onClose }: CreateChatroomModalProps) => {
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

  const handleSubmit = (values: CreateChatroomFormValues) => {
    submit({ ...values, intent: 'create-chatroom' }, { method: 'post' });
    onClose();
    form.reset();
  };

  return (
    <BasicModal
      opened={opened}
      onClose={close}
      title='創建聊天室'
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
              取消
            </Button>
            <Button type='submit'>建立</Button>
          </Group>
        </Stack>
      </form>
    </BasicModal>
  );
};

export default CreateChatroomModal;
