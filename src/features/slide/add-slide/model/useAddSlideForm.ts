import type { FormEvent } from 'react';

import { useForm } from '@mantine/form';

import { selectAddSlide, useSlideStore, type Slide } from '@entities/slide';
import { notifySuccess } from '@shared/lib';

export interface AddSlideFormValues {
  title: string;
  annotation: string;
}

export const SLIDE_TITLE_MAX_LENGTH = 80;
export const SLIDE_ANNOTATION_MAX_LENGTH = 300;

interface UseAddSlideFormOptions {
  onAdded?: (slide: Slide) => void;
}

export const useAddSlideForm = ({ onAdded }: UseAddSlideFormOptions = {}) => {
  const addSlide = useSlideStore(selectAddSlide);

  const form = useForm<AddSlideFormValues>({
    mode: 'controlled',
    initialValues: { title: '', annotation: '' },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : 'Заголовок обязателен'),
    },
  });

  const handleSubmit: (event?: FormEvent<HTMLFormElement>) => void = form.onSubmit((values) => {
    const slide = addSlide({ title: values.title.trim(), annotation: values.annotation.trim() });

    notifySuccess(`Слайд «${slide.title}» добавлен`);
    form.reset();
    onAdded?.(slide);
  });

  return { form, handleSubmit };
};
