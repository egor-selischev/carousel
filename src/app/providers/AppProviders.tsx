import type { ReactNode } from 'react';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { theme } from '../styles/theme';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <MantineProvider theme={theme} defaultColorScheme="light">
    <Notifications position="bottom-right" autoClose={3000} />
    {children}
  </MantineProvider>
);
