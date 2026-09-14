import { useCallback, useSyncExternalStore } from 'react';

import type { EmblaCarouselType } from 'embla-carousel';

export interface CarouselPagination {
  selectedIndex: number;
  snapCount: number;
  scrollTo: (index: number) => void;
}

const noopUnsubscribe = (): void => {};

export const useCarouselPagination = (embla: EmblaCarouselType | null): CarouselPagination => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!embla) {
        return noopUnsubscribe;
      }

      embla.on('select', onChange).on('reInit', onChange);

      return () => {
        embla.off('select', onChange).off('reInit', onChange);
      };
    },
    [embla],
  );

  const selectedIndex = useSyncExternalStore(subscribe, () => embla?.selectedScrollSnap() ?? 0);
  const snapCount = useSyncExternalStore(subscribe, () => embla?.scrollSnapList().length ?? 0);

  const scrollTo = useCallback(
    (index: number) => {
      embla?.scrollTo(index);
    },
    [embla],
  );

  return { selectedIndex, snapCount, scrollTo };
};
