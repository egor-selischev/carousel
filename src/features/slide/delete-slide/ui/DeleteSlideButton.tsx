import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface DeleteSlideButtonProps {
  slideTitle: string;
  onClick: () => void;
}

export const DeleteSlideButton = ({ slideTitle, onClick }: DeleteSlideButtonProps) => (
  <ActionIcon
    variant="subtle"
    color="red"
    size="lg"
    aria-label={`Удалить слайд «${slideTitle}»`}
    onClick={onClick}
  >
    <IconTrash size={18} />
  </ActionIcon>
);
