import { Divider, Flex, Menu, Title } from '@mantine/core';
import { useNavigate } from 'react-router';
import BackButton from '~/components/back-button';
import MoreButton from '~/components/more-button';

interface HeaderProps {
  roomName: string;
  handleMembers: () => void;
  handleJoin: () => void;
  handleChange: () => void;
  handleLeave: () => void;
  handleDelete: () => void;
}

const Header = ({
  roomName,
  handleMembers,
  handleJoin,
  handleChange,
  handleLeave,
  handleDelete 
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Flex align='center' py='sm'>
        <BackButton onClick={handleBack} />
        <Title size={24}>{roomName}</Title>
        <Menu>
          <Menu.Target>
            <MoreButton />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={handleMembers}>成員</Menu.Item>
            <Menu.Item onClick={handleJoin}>邀請成員</Menu.Item>
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
