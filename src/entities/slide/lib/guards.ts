import { isRecord } from '@shared/lib';

import type { Slide } from '../model/types';

export const isSlide = (value: unknown): value is Slide =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.title === 'string' &&
  typeof value.annotation === 'string' &&
  typeof value.isChecked === 'boolean';

export const isSlideArray = (value: unknown): value is Slide[] =>
  Array.isArray(value) && value.every(isSlide);
