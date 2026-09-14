import { AppShell, Container } from '@mantine/core';

import { AppHeader } from '@widgets/app-header';
import { SlidesCarousel } from '@widgets/slides-carousel';

export const HomePage = () => (
  <AppShell header={{ height: 60 }} padding="md">
    <AppShell.Header>
      <AppHeader />
    </AppShell.Header>
    <AppShell.Main>
      <Container size="sm" py="lg" px={0}>
        <SlidesCarousel />
      </Container>
    </AppShell.Main>
  </AppShell>
);
