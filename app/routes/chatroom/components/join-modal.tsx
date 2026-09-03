import {
  Button,
  Group,
  Modal,
  Stack,
  TagsInput,
  type ModalProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useSubmit } from 'react-router';
import {
  joinChatroomFormSchema,
  type JoinChatroomFormValues,
} from '~/services/chatroom-services';

interface JoinModalProps extends ModalProps {
  hasRoomName: boolean;
}

const JoinModal = ({ opened, onClose, hasRoomName }: JoinModalProps) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      usernames: [],
    },
    validate: schemaResolver(joinChatroomFormSchema(hasRoomName)),
  });
  const submit = useSubmit();

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values: JoinChatroomFormValues) => {
    submit({ ...values, intent: 'join' }, { method: 'post' });
    onClose();
    form.reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='邀請成員'
      withCloseButton={false}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TagsInput
            key={form.key('usernames')}
            {...form.getInputProps('usernames')}
            placeholder='請輸入使用者名稱'
            label='使用者名稱'
          />
          <Group justify='end'>
            <Button type='button' color='gray' onClick={handleClose}>
              取消
            </Button>
            <Button type='submit'>增加</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default JoinModal;
