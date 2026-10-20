import { Modal, type ModalProps } from '@mantine/core';

const BasicModal = ({ title, opened, onClose, children }: ModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      centered
    >
      {children}
    </Modal>
  );
};

export default BasicModal;
