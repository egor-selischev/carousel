import { useCallback, useEffect, useRef, useState } from 'react';

import { useDisclosure } from '@mantine/hooks';
import type { EmblaCarouselType } from 'embla-carousel';

import { selectSlides, useSlideStore, type Slide } from '@entities/slide';
import { useCarouselPagination } from '@shared/hooks';

export const useSlidesCarousel = () => {
  const slides = useSlideStore(selectSlides);
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const pagination = useCarouselPagination(embla);

  const [isAddModalOpened, addModal] = useDisclosure(false);
  const [isDeleteModalOpened, deleteModal] = useDisclosure(false);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);

  const shouldScrollToLastRef = useRef(false);

  useEffect(() => {
    if (!shouldScrollToLastRef.current || !embla) {
      return;
    }

    shouldScrollToLastRef.current = false;
    embla.reInit();
    embla.scrollTo(slides.length - 1);
  }, [embla, slides.length]);

  const handleSlideAdded = useCallback(() => {
    shouldScrollToLastRef.current = true;
  }, []);

  const requestDelete = useCallback(
    (slide: Slide) => {
      setSlideToDelete(slide);
      deleteModal.open();
    },
    [deleteModal],
  );

  return {
    slides,
    setEmbla,
    pagination,
    addModal: { opened: isAddModalOpened, open: addModal.open, close: addModal.close },
    deleteModal: { opened: isDeleteModalOpened, slide: slideToDelete, close: deleteModal.close },
    handleSlideAdded,
    requestDelete,
  };
};
