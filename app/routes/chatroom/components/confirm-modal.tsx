import { Button, Group, Modal, Text } from '@mantine/core';

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
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      withCloseButton={false}
      centered
    >
      <Group justify='end'>
        <Button type='button' color='grey' onClick={onClose}>
          取消
        </Button>
        <Button c='white' bg='red' type='button' onClick={onConfirm}>
          確認
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmModal;
