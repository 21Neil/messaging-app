import { Button, Group, Modal } from '@mantine/core';
import { useNavigate } from 'react-router';
import chatroomServices from '~/services/chatroom-services';

interface DeleteChatroomConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  roomId: number;
}

const DeleteChatroomConfirmModal = ({
  opened,
  onClose,
  roomId,
}: DeleteChatroomConfirmModalProps) => {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const res = await chatroomServices.deleteChatroom(roomId);
    
    if (res) navigate(-1);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='刪除聊天室'
      withCloseButton={false}
      centered
    >
      <Group justify='end'>
        <Button type='button' color='grey' onClick={onClose}>
          取消
        </Button>
        <Button type='button' onClick={handleConfirm}>
          確認
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteChatroomConfirmModal;
