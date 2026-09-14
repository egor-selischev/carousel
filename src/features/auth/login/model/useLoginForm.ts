import { useState, type FormEvent } from 'react';

import { useForm, type FormErrors } from '@mantine/form';

import { selectStartSession, useSessionStore } from '@entities/user';
import { loginRequest } from '@shared/api';
import { isValidEmail, notifyError, notifySuccess } from '@shared/lib';

export interface LoginFormValues {
  email: string;
  password: string;
}

export const PASSWORD_MIN_LENGTH = 3;

const getFirstErrorMessage = (errors: FormErrors): string => {
  const [firstError] = Object.values(errors);

  return typeof firstError === 'string' ? firstError : 'Проверьте правильность заполнения формы';
};

export const useLoginForm = () => {
  const startSession = useSessionStore(selectStartSession);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    mode: 'controlled',
    initialValues: { email: '', password: '' },
    validateInputOnBlur: true,
    validate: {
      email: (value) => (isValidEmail(value) ? null : 'Неверный формат email'),
      password: (value) =>
        value.length >= PASSWORD_MIN_LENGTH
          ? null
          : `Пароль должен содержать не менее ${String(PASSWORD_MIN_LENGTH)} символов`,
    },
  });

  const login = async ({ email, password }: LoginFormValues): Promise<void> => {
    setIsSubmitting(true);

    try {
      const { token } = await loginRequest({ email: email.trim(), password });

      if (!startSession(token)) {
        notifyError('Сервер вернул некорректный токен', 'Ошибка входа');
        return;
      }

      notifySuccess('Вы успешно вошли в систему');
    } catch {
      notifyError('Не удалось войти, попробуйте ещё раз', 'Ошибка входа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit: (event?: FormEvent<HTMLFormElement>) => void = form.onSubmit(
    (values) => {
      void login(values);
    },
    (errors) => {
      notifyError(getFirstErrorMessage(errors), 'Ошибка валидации');
    },
  );

  return { form, handleSubmit, isSubmitting };
};
