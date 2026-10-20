import { Button, Group } from '@mantine/core';
import BasicModal from './basic-modal';

interface ConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
}

const ConfirmModal = ({
  opened,
  onClose,
  title,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <BasicModal
      opened={opened}
      onClose={onClose}
      title={title}
    >
      <Group justify='end'>
        <Button type='button' color='grey' onClick={onClose}>
          取消
        </Button>
        <Button c='white' bg='red' type='button' onClick={onConfirm}>
          確認
        </Button>
      </Group>
    </BasicModal>
  );
};

export default ConfirmModal;
