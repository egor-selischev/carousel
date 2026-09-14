import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectEndSession, useSessionStore } from '@entities/user';
import { ROUTES } from '@shared/config';
import { notifySuccess } from '@shared/lib';

export const useLogout = (): (() => void) => {
  const endSession = useSessionStore(selectEndSession);
  const navigate = useNavigate();

  return useCallback(() => {
    endSession();
    notifySuccess('Вы вышли из аккаунта');
    navigate(ROUTES.LOGIN, { replace: true });
  }, [endSession, navigate]);
};
