import { useCallback } from 'react';

import { selectRemoveSlide, useSlideStore, type Slide } from '@entities/slide';
import { notifySuccess } from '@shared/lib';

export const useDeleteSlide = (): ((slide: Slide) => void) => {
  const removeSlide = useSlideStore(selectRemoveSlide);

  return useCallback(
    (slide: Slide) => {
      removeSlide(slide.id);
      notifySuccess(`Слайд «${slide.title}» удалён`);
    },
    [removeSlide],
  );
};
