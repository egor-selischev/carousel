import { Navigate, createBrowserRouter } from 'react-router-dom';

import { HomePage } from '@pages/home';
import { LoginPage } from '@pages/login';
import { ROUTES } from '@shared/config';

import { GuestRoute, ProtectedRoute } from './guards';

export const router = createBrowserRouter(
  [
    {
      element: <GuestRoute />,
      children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
    },
    {
      element: <ProtectedRoute />,
      children: [{ path: ROUTES.HOME, element: <HomePage /> }],
    },
    { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
  ],
  {
    basename: import.meta.env.BASE_URL,
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
