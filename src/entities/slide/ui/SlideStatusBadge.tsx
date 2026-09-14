import { Badge } from '@mantine/core';

interface SlideStatusBadgeProps {
  isChecked: boolean;
}

export const SlideStatusBadge = ({ isChecked }: SlideStatusBadgeProps) => (
  <Badge color={isChecked ? 'teal' : 'gray'} variant={isChecked ? 'filled' : 'light'}>
    {isChecked ? 'Отмечен' : 'Не отмечен'}
  </Badge>
);
