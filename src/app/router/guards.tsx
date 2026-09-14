import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { selectIsAuthenticated, useSessionStore } from '@entities/user';
import { ROUTES } from '@shared/config';
import { isRecord } from '@shared/lib';

interface RedirectState {
  from: string;
}

const getRedirectPath = (state: unknown): string =>
  isRecord(state) && typeof state.from === 'string' && state.from !== ROUTES.LOGIN
    ? state.from
    : ROUTES.HOME;

export const ProtectedRoute = () => {
  const isAuthenticated = useSessionStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const state: RedirectState = { from: location.pathname };

    return <Navigate to={ROUTES.LOGIN} replace state={state} />;
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const isAuthenticated = useSessionStore(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  return <Outlet />;
};
