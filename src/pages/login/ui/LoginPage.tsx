import { Center, Paper, Text, Title } from '@mantine/core';

import { LoginForm } from '@features/auth/login';

export const LoginPage = () => (
  <Center mih="100dvh" p="md">
    <Paper withBorder shadow="md" radius="md" p="xl" w="100%" maw={420}>
      <Title order={1} size="h2">
        Вход
      </Title>
      <Text size="sm" c="dimmed" mt={4} mb="lg">
        Демо-режим: подойдёт любой корректный email и пароль от 3 символов
      </Text>
      <LoginForm />
    </Paper>
  </Center>
);
