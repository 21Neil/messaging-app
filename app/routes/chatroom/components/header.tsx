import { Button, Divider, Flex, Menu, Title } from '@mantine/core';
import { IoIosArrowBack, IoMdMore } from 'react-icons/io';
import { useNavigate } from 'react-router';

interface HeaderProps {
  roomName: string;
  handleChange: () => void;
  handleLeave: () => void;
  handleDelete: () => void;
}

const Header = ({ roomName, handleChange, handleLeave, handleDelete }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Flex align='center' py='sm'>
        <Button
          variant='transparent'
          color='black'
          fz={20}
          px='xs'
          onClick={handleBack}
        >
          <IoIosArrowBack />
        </Button>
        <Title size={24}>{roomName}</Title>
        <Menu>
          <Menu.Target>
            <Button
              ml='auto'
              variant='transparent'
              color='black'
              fz={20}
              px='xs'
            >
              <IoMdMore />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={handleChange}>變更聊天室名稱</Menu.Item>
            <Menu.Item c='red' onClick={handleLeave}>離開聊天室</Menu.Item>
            <Menu.Item c='red' onClick={handleDelete}>
              刪除聊天室
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <Divider />
    </>
  );
};

export default Header;
