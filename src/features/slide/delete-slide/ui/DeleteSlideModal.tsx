import { Button, Group, Modal, Text } from '@mantine/core';

import type { Slide } from '@entities/slide';

import { useDeleteSlide } from '../model/useDeleteSlide';

interface DeleteSlideModalProps {
  opened: boolean;
  slide: Slide | null;
  onClose: () => void;
}

export const DeleteSlideModal = ({ opened, slide, onClose }: DeleteSlideModalProps) => {
  const deleteSlide = useDeleteSlide();

  const handleConfirm = () => {
    if (slide) {
      deleteSlide(slide);
    }

    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Удаление слайда" centered>
      <Text style={{ wordBreak: 'break-word' }}>Удалить слайд «{slide?.title}»?</Text>
      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onClose}>
          Отмена
        </Button>
        <Button color="red" onClick={handleConfirm} data-autofocus>
          Удалить
        </Button>
      </Group>
    </Modal>
  );
};
