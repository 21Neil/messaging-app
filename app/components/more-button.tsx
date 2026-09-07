import { Button } from '@mantine/core';
import { IoMdMore } from 'react-icons/io';

const MoreButton = ({ ref, ...others }: React.ComponentProps<'button'>) => {
  return (
    <Button ml='auto' variant='transparent' color='black' fz={20} px='xs' ref={ref} {...others}>
      <IoMdMore />
    </Button>
  );
};

export default MoreButton;
