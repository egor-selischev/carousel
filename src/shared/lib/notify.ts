import { notifications } from '@mantine/notifications';

export const notifySuccess = (message: string, title?: string): void => {
  notifications.show({ color: 'teal', title, message });
};

export const notifyError = (message: string, title?: string): void => {
  notifications.show({ color: 'red', title, message });
};
