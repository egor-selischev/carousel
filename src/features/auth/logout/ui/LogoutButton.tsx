import { Button } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

import { useLogout } from '../model/useLogout';

export const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button variant="light" color="red" leftSection={<IconLogout size={16} />} onClick={logout}>
      Выйти
    </Button>
  );
};
