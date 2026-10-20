import { Button } from '@mantine/core';

const BasicButton = ({
  ref,
  children,
  ...others
}: React.ComponentProps<'button'>) => {
  return (
    <Button
      variant='transparent'
      color='black'
      fz={20}
      px='xs'
      ref={ref}
      {...others}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
