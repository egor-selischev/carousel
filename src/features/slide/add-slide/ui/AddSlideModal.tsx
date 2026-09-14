import { Button, Group, Modal, Stack, TextInput, Textarea } from '@mantine/core';

import type { Slide } from '@entities/slide';

import {
  SLIDE_ANNOTATION_MAX_LENGTH,
  SLIDE_TITLE_MAX_LENGTH,
  useAddSlideForm,
} from '../model/useAddSlideForm';

interface AddSlideModalProps {
  opened: boolean;
  onClose: () => void;
  onAdded?: (slide: Slide) => void;
}

export const AddSlideModal = ({ opened, onClose, onAdded }: AddSlideModalProps) => {
  const { form, handleSubmit } = useAddSlideForm({
    onAdded: (slide) => {
      onClose();
      onAdded?.(slide);
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Новый слайд" centered>
      <form onSubmit={handleSubmit} noValidate>
        <Stack>
          <TextInput
            label="Заголовок"
            placeholder="Например, «Итоги спринта»"
            withAsterisk
            data-autofocus
            maxLength={SLIDE_TITLE_MAX_LENGTH}
            key={form.key('title')}
            {...form.getInputProps('title')}
          />
          <Textarea
            label="Аннотация"
            placeholder="Необязательно"
            autosize
            minRows={3}
            maxRows={6}
            maxLength={SLIDE_ANNOTATION_MAX_LENGTH}
            key={form.key('annotation')}
            {...form.getInputProps('annotation')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit">Добавить</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
