import { Avatar, Button, Flex, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { useFetcher } from 'react-router';
import BasicModal from '~/components/basic-modal';
import type { FriendRequest } from '~/services/friend-services';

interface FriendRequestsModalProps {
  opened: boolean;
  onClose: () => void;
  requests?: FriendRequest[];
}

const FriendRequestsModal = ({ opened, onClose, requests }: FriendRequestsModalProps) => {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  const handleAccept = (id: number) => {
    fetcher.submit({ id, intent: 'accept-friend' }, { method: 'patch' });
  };

  return (
    <BasicModal opened={opened} onClose={onClose} title='交友邀請'>
      <Stack>
        <ScrollArea mah='60vh'>
          <Stack>
            {!requests ? (
              <Text c='dimmed'>無法載入交友邀請，請重新整理後再試</Text>
            ) : requests.length === 0 ? (
              <Text c='dimmed'>目前沒有待處理的交友邀請</Text>
            ) : requests.map(item => (
              <Flex key={item.id} gap={8} align='center'>
                <Avatar src={item.sender.avatar} />
                <Stack gap={0} flex={1}>
                  <Text>{item.sender.name}</Text>
                  <Text c='dimmed' fz={12}>{item.sender.username}</Text>
                </Stack>
                <Button
                  onClick={() => handleAccept(item.id)}
                  disabled={isPending}
                  loading={isPending && fetcher.formData?.get('id') === String(item.id)}
                >
                  同意
                </Button>
              </Flex>
            ))}
          </Stack>
        </ScrollArea>
        <Group justify='end'>
          <Button color='gray' onClick={onClose}>關閉</Button>
        </Group>
      </Stack>
    </BasicModal>
  );
};

export default FriendRequestsModal;
