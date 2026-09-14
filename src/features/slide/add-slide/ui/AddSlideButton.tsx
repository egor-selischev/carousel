import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

interface AddSlideButtonProps {
  onClick: () => void;
}

export const AddSlideButton = ({ onClick }: AddSlideButtonProps) => (
  <Button leftSection={<IconPlus size={16} />} onClick={onClick}>
    Добавить слайд
  </Button>
);
