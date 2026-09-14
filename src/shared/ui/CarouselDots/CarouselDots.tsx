import { Group, UnstyledButton } from '@mantine/core';

export interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const CarouselDots = ({ count, activeIndex, onSelect }: CarouselDotsProps) => {
  if (count < 2) {
    return null;
  }

  return (
    <Group justify="center" gap={8} mt="md" aria-label="Пагинация слайдов">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <UnstyledButton
            key={index}
            aria-label={`Перейти к слайду ${index + 1}`}
            aria-current={isActive}
            onClick={() => onSelect(index)}
            w={isActive ? 24 : 10}
            h={10}
            bg={isActive ? 'blue.6' : 'gray.4'}
            style={{ borderRadius: 'var(--mantine-radius-xl)', transition: 'width 150ms ease' }}
          />
        );
      })}
    </Group>
  );
};
