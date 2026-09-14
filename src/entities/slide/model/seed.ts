import type { Slide } from './types';

export const SEED_SLIDES: readonly Slide[] = [
  {
    id: 'seed-1',
    title: 'Feature-Sliced Design',
    annotation: 'Слои app → pages → widgets → features → entities → shared, импорты только вниз.',
    isChecked: true,
  },
  {
    id: 'seed-2',
    title: 'Mantine UI',
    annotation: 'Формы, модальные окна, уведомления и лэйаут на готовых компонентах.',
    isChecked: false,
  },
  {
    id: 'seed-3',
    title: 'Embla Carousel',
    annotation: 'Карусель на @mantine/carousel, пагинация синхронизирована через Embla API.',
    isChecked: false,
  },
  {
    id: 'seed-4',
    title: 'Zustand + localStorage',
    annotation: 'Слайды и сессия переживают перезагрузку страницы.',
    isChecked: false,
  },
];
