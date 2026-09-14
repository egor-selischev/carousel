import { Checkbox } from '@mantine/core';

import type { Slide } from '@entities/slide';

import { useToggleSlideChecked } from '../model/useToggleSlideChecked';

interface ToggleSlideCheckedProps {
  slide: Slide;
}

export const ToggleSlideChecked = ({ slide }: ToggleSlideCheckedProps) => {
  const toggleChecked = useToggleSlideChecked();

  return (
    <Checkbox
      label="Отметить слайд"
      checked={slide.isChecked}
      onChange={() => toggleChecked(slide.id)}
    />
  );
};
