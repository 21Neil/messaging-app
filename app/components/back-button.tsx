import { Button } from '@mantine/core';
import { IoIosArrowBack } from 'react-icons/io';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <Button
      variant='transparent'
      color='black'
      fz={20}
      px='xs'
      onClick={onClick}
    >
      <IoIosArrowBack />
    </Button>
  );
};

export default BackButton;
