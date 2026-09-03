import { Button, Flex, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IoSend } from 'react-icons/io5';
import { useSubmit } from 'react-router';
import type { MessageFromValue } from '~/services/chatroom-services';

const ChatInput = () => {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      content: '',
    },
  });

  const handleSubmit = async (values: MessageFromValue) => {
    await submit({ ...values, intent: 'send-message' }, { method: 'post' });
    form.reset();
  };
  
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex px={12} pb={6}>
        <TextInput
          w='100%'
          radius='xl'
          key={form.key('content')}
          {...form.getInputProps('content')}
        />
        <Button
          type='submit'
          fz={16}
          variant='transparent'
          p={8}
          pos='absolute'
          right={16}
        >
          <IoSend />
        </Button>
      </Flex>
    </form>
  );
};

export default ChatInput;
