import { create } from 'zustand';

import { STORAGE_KEYS } from '@shared/config';
import { getFromStorage, saveToStorage } from '@shared/lib';

import { isSlideArray } from '../lib/guards';
import { SEED_SLIDES } from './seed';
import type { NewSlide, Slide } from './types';

interface SlideState {
  slides: Slide[];
  addSlide: (input: NewSlide) => Slide;
  removeSlide: (id: Slide['id']) => void;
  toggleSlideChecked: (id: Slide['id']) => void;
}

const loadSlides = (): Slide[] =>
  getFromStorage(STORAGE_KEYS.SLIDES, isSlideArray) ?? [...SEED_SLIDES];

export const useSlideStore = create<SlideState>()((set) => ({
  slides: loadSlides(),

  addSlide: (input) => {
    const slide: Slide = { id: crypto.randomUUID(), ...input, isChecked: false };

    set((state) => ({ slides: [...state.slides, slide] }));

    return slide;
  },

  removeSlide: (id) => {
    set((state) => ({ slides: state.slides.filter((slide) => slide.id !== id) }));
  },

  toggleSlideChecked: (id) => {
    set((state) => ({
      slides: state.slides.map((slide) =>
        slide.id === id ? { ...slide, isChecked: !slide.isChecked } : slide,
      ),
    }));
  },
}));

useSlideStore.subscribe((state, prevState) => {
  if (state.slides !== prevState.slides) {
    saveToStorage(STORAGE_KEYS.SLIDES, state.slides);
  }
});

export const selectSlides = (state: SlideState): Slide[] => state.slides;

export const selectAddSlide = (state: SlideState): SlideState['addSlide'] => state.addSlide;

export const selectRemoveSlide = (state: SlideState): SlideState['removeSlide'] =>
  state.removeSlide;

export const selectToggleSlideChecked = (state: SlideState): SlideState['toggleSlideChecked'] =>
  state.toggleSlideChecked;
