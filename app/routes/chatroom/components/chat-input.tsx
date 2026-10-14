import { Button, Divider, FileInput, Flex, TextInput } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { IoSend } from 'react-icons/io5';
import { useSubmit } from 'react-router';
import {
  messageSchema,
  type MessageFromValue,
} from '~/services/chatroom-services';
import ImageInput from './image-input';
import styles from '../chatroom.module.css';
import { useEffect, useRef, useState } from 'react';

const ChatInput = () => {
  const [submitCount, setSubmitCount] = useState(0);

  const submit = useSubmit();
  const contentInputElement = useRef<HTMLInputElement>(null);
  const form = useForm<MessageFromValue>({
    mode: 'uncontrolled',
    initialValues: {
      content: '',
    },
    validate: schemaResolver(messageSchema),
  });

  const handleSubmit = async (values: MessageFromValue) => {
    await submit({ ...values, intent: 'send-message' }, { method: 'post' });
    form.reset();
    setSubmitCount(submitCount + 1);
  };

  useEffect(() => {
    if (submitCount === 0) return;
    
    contentInputElement.current?.focus();
  }, [submitCount]);

  return (
    <div>
      <Divider />
      <Flex px={12} py={6}>
        <ImageInput />
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className={styles.messageInputForm}
        >
          <Flex w='100%'>
            <TextInput
              w='100%'
              radius='xl'
              key={form.key('content')}
              {...form.getInputProps('content')}
              flex={1}
              ref={contentInputElement}
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
      </Flex>
    </div>
  );
};

export default ChatInput;
