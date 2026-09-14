import { Carousel } from '@mantine/carousel';
import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';

import { SlideCard } from '@entities/slide';
import { AddSlideButton, AddSlideModal } from '@features/slide/add-slide';
import { DeleteSlideButton, DeleteSlideModal } from '@features/slide/delete-slide';
import { ToggleSlideChecked } from '@features/slide/toggle-checked';
import { CarouselDots } from '@shared/ui';

import { useSlidesCarousel } from '../model/useSlidesCarousel';

export const SlidesCarousel = () => {
  const { slides, setEmbla, pagination, addModal, deleteModal, handleSlideAdded, requestDelete } =
    useSlidesCarousel();

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Карусель</Title>
          <Text size="sm" c="dimmed">
            {slides.length > 0
              ? `Слайд ${String(pagination.selectedIndex + 1)} из ${String(slides.length)}`
              : 'Слайдов пока нет'}
          </Text>
        </div>
        <AddSlideButton onClick={addModal.open} />
      </Group>

      {slides.length > 0 ? (
        <Box>
          <Carousel
            getEmblaApi={setEmbla}
            slideSize="100%"
            slideGap="md"
            withIndicators={false}
            controlsOffset="xs"
            controlSize={32}
          >
            {slides.map((slide) => (
              <Carousel.Slide key={slide.id}>
                <Box px={48} h="100%">
                  <SlideCard
                    slide={slide}
                    actions={
                      <DeleteSlideButton
                        slideTitle={slide.title}
                        onClick={() => requestDelete(slide)}
                      />
                    }
                    footer={<ToggleSlideChecked slide={slide} />}
                  />
                </Box>
              </Carousel.Slide>
            ))}
          </Carousel>

          <CarouselDots
            count={pagination.snapCount}
            activeIndex={pagination.selectedIndex}
            onSelect={pagination.scrollTo}
          />
        </Box>
      ) : (
        <Paper withBorder radius="md" p="xl">
          <Text ta="center" c="dimmed">
            Добавьте первый слайд, чтобы увидеть карусель
          </Text>
        </Paper>
      )}

      <AddSlideModal opened={addModal.opened} onClose={addModal.close} onAdded={handleSlideAdded} />
      <DeleteSlideModal
        opened={deleteModal.opened}
        slide={deleteModal.slide}
        onClose={deleteModal.close}
      />
    </Stack>
  );
};
