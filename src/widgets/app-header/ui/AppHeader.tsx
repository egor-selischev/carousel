import { Group, Text, Title } from '@mantine/core';

import { selectCurrentUser, useSessionStore } from '@entities/user';
import { LogoutButton } from '@features/auth/logout';

export const AppHeader = () => {
  const user = useSessionStore(selectCurrentUser);

  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Title order={1} size="h3">
        Слайды
      </Title>
      <Group gap="md" wrap="nowrap">
        {user && (
          <Text size="sm" c="dimmed" visibleFrom="sm">
            {user.email}
          </Text>
        )}
        <LogoutButton />
      </Group>
    </Group>
  );
};
