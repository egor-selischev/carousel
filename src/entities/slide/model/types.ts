export interface Slide {
  id: string;
  title: string;
  annotation: string;
  isChecked: boolean;
}

export type NewSlide = Pick<Slide, 'title' | 'annotation'>;
