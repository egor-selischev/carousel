import type { ReactNode } from 'react';

import { Card, Group, Text, Title } from '@mantine/core';

import type { Slide } from '../model/types';
import { SlideStatusBadge } from './SlideStatusBadge';

interface SlideCardProps {
  slide: Slide;
  actions?: ReactNode;
  footer?: ReactNode;
}

export const SlideCard = ({ slide, actions, footer }: SlideCardProps) => (
  <Card withBorder shadow="sm" radius="md" padding="lg" h="100%" mih={220}>
    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
      <Title order={3} size="h4" style={{ wordBreak: 'break-word' }}>
        {slide.title}
      </Title>
      {actions}
    </Group>

    <Group mt="xs">
      <SlideStatusBadge isChecked={slide.isChecked} />
    </Group>

    <Text c="dimmed" mt="md" style={{ flex: 1, wordBreak: 'break-word' }}>
      {slide.annotation || 'Без аннотации'}
    </Text>

    {footer && <Group mt="lg">{footer}</Group>}
  </Card>
);
