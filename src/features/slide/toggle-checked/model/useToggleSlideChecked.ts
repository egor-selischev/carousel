import { selectToggleSlideChecked, useSlideStore, type Slide } from '@entities/slide';

export const useToggleSlideChecked = (): ((id: Slide['id']) => void) =>
  useSlideStore(selectToggleSlideChecked);
