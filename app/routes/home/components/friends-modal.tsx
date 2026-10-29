import { Avatar, Button, Flex, Group, ScrollArea, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import BasicModal from '~/components/basic-modal';
import type { Member } from '~/services/chatroom-services';

interface FriendsModalProps {
  opened: boolean;
  onClose: () => void;
  friends?: Member[];
}

const FriendsModal = ({ opened, onClose, friends }: FriendsModalProps) => {
  const [search, setSearch] = useState('');
  const query = search.trim().toLocaleLowerCase();
  const filteredFriends = friends?.filter(friend =>
    [friend.name, friend.username].some(value =>
      value.toLocaleLowerCase().includes(query),
    ),
  );

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  return (
    <BasicModal opened={opened} onClose={handleClose} title='朋友清單'>
      <Stack>
        <TextInput
          label='搜尋朋友'
          placeholder='輸入名稱或帳號'
          value={search}
          onChange={event => setSearch(event.currentTarget.value)}
          disabled={!friends || friends.length === 0}
        />
        {friends && <Text c='dimmed' size='sm'>共 {friends.length} 位朋友</Text>}
        <ScrollArea mah='60vh'>
          <Stack>
            {!friends ? (
              <Text c='dimmed' role='status'>無法載入朋友清單，請重新整理後再試</Text>
            ) : friends.length === 0 ? (
              <Text c='dimmed' role='status'>目前還沒有朋友，可以從好友選單新增好友</Text>
            ) : filteredFriends?.length === 0 ? (
              <Text c='dimmed' role='status'>找不到符合的朋友，請試試其他名稱或帳號</Text>
            ) : filteredFriends?.map(friend => (
              <Flex key={friend.id} gap={8} align='center'>
                <Avatar src={friend.avatar} alt={friend.name} />
                <Stack gap={0} style={{ minWidth: 0 }}>
                  <Text style={{ overflowWrap: 'anywhere' }}>{friend.name}</Text>
                  <Text c='dimmed' fz={12} style={{ overflowWrap: 'anywhere' }}>{friend.username}</Text>
                </Stack>
              </Flex>
            ))}
          </Stack>
        </ScrollArea>
        <Group justify='end'>
          <Button type='button' color='gray' onClick={handleClose}>關閉</Button>
        </Group>
      </Stack>
    </BasicModal>
  );
};

export default FriendsModal;
