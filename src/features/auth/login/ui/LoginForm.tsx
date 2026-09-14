import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';

import { useLoginForm } from '../model/useLoginForm';

export const LoginForm = () => {
  const { form, handleSubmit, isSubmitting } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          withAsterisk
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Пароль"
          placeholder="Не менее 3 символов"
          autoComplete="current-password"
          withAsterisk
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Button type="submit" loading={isSubmitting} fullWidth mt="sm">
          Войти
        </Button>
      </Stack>
    </form>
  );
};
