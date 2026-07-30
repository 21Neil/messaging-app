import { notifications } from '@mantine/notifications';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

const showError = (msg: string) => {
  notifications.show({
    color: 'red',
    title: 'Error',
    message: msg,
    icon: <MdErrorOutline />,
  });
};

const showSuccess = (msg: string) => {
  notifications.show({
    color: 'green',
    title: 'Success',
    message: msg,
    icon: <MdCheckCircle />
  })
}

const showNotification = (msg: string) => {
  notifications.show({
    message: msg,
  });
};

const customNotifications = {
  showError,
  showSuccess,
  showNotification,
};

export default customNotifications;
