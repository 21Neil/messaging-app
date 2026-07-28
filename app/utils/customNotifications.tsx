import { notifications } from '@mantine/notifications';
import { MdErrorOutline } from 'react-icons/md';

const showError = (msg: string) => {
  notifications.show({
    color: 'red',
    title: 'Error',
    message: msg,
    icon: <MdErrorOutline />,
  });
};

const customNotifications = {
  showError,
};

export default customNotifications;
