export type { Slide, NewSlide } from './model/types';
export {
  useSlideStore,
  selectSlides,
  selectAddSlide,
  selectRemoveSlide,
  selectToggleSlideChecked,
} from './model/store';
export { SlideCard } from './ui/SlideCard';
