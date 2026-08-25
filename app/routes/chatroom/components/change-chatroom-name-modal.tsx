import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  type ModalProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import {
  changeChatroomNameSchema,
  type changeChatroomNameFormValues,
  type Member,
} from '~/services/chatroom-services';
import { useSubmit } from 'react-router';
import { useEffect } from 'react';

interface ChangeChatroomNameModalProps extends ModalProps {
  members: Member[];
  name: string;
}

const ChangeChatroomNameModal = ({
  opened,
  onClose,
  members,
  name,
}: ChangeChatroomNameModalProps) => {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name,
    },
    validate: schemaResolver(changeChatroomNameSchema(members)),
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values: changeChatroomNameFormValues) => {
    submit({ ...values, intent: 'change-name' }, { method: 'post' });
    onClose();
  };

  useEffect(() => {
    form.setInitialValues({ name });
  }, [name]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='變更聊天室名稱'
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
          <Group justify='end'>
            <Button type='button' color='gray' onClick={handleClose}>
              取消
            </Button>
            <Button type='submit'>變更</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ChangeChatroomNameModal;
