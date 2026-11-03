import { Avatar, Button, Flex, Group, Modal, ScrollArea, Stack, Text, TextInput, useModalsStack, type ModalStackProps } from '@mantine/core';
import { useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import type { Member } from '~/services/chatroom-services';
import type { clientAction } from '../home';
import BasicModal from '~/components/basic-modal';
import ConfirmModal from '~/components/confirm-modal';

interface FriendsModalProps {
  stack: ReturnType<typeof useModalsStack<'friends' | 'delete-friend'>>;
  friends?: Member[];
}

const FriendsModal = ({ stack, friends }: FriendsModalProps) => {
  const [search, setSearch] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<typeof clientAction>();
  const selectedFriend = friends?.find(friend => friend.id === selectedFriendId);
  const query = search.trim().toLocaleLowerCase();
  const filteredFriends = friends?.filter(friend =>
    [friend.name, friend.username].some(value =>
      value.toLocaleLowerCase().includes(query),
    ),
  );

  const handleClose = () => {
    setSearch('');
    setSelectedFriendId(null);
    stack.closeAll();
  };

  const handleDelete = (id: number) => {
    setSelectedFriendId(id);
    stack.open('delete-friend');
  }

  const handleDeleteConfirm = () => {
    if (!selectedFriend) return;

    fetcher.submit(
      { id: selectedFriend.id, intent: 'delete-friend' },
      { method: 'delete' },
    );

    stack.closeAll();
  };

  const handleCancelDelete = () => {
    stack.close('delete-friend');;
    setSelectedFriendId(null);
  };

  return (
    <Modal.Stack>
      <BasicModal
        title='朋友清單'
        {...stack.register('friends')}
      >
        <Stack>
          <TextInput
            ref={searchInputRef}
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
                  <Stack gap={0} flex={1} style={{ minWidth: 0 }}>
                    <Text style={{ overflowWrap: 'anywhere' }}>{friend.name}</Text>
                    <Text c='dimmed' fz={12} style={{ overflowWrap: 'anywhere' }}>{friend.username}</Text>
                  </Stack>
                  <Button
                    type='button'
                    color='red'
                    onClick={() => handleDelete(friend.id)}
                  >
                    刪除
                  </Button>
                </Flex>
              ))}
            </Stack>
          </ScrollArea>
          <Group justify='end'>
            <Button type='button' color='gray' onClick={handleClose}>關閉</Button>
          </Group>
        </Stack>
      </BasicModal>
      <ConfirmModal
        {...stack.register('delete-friend')}
        title={`確認刪除與 ${selectedFriend?.name} 的好友關係？`}
        onConfirm={handleDeleteConfirm}
        onClose={handleCancelDelete}
      />
    </Modal.Stack>
  );
};

export default FriendsModal;
