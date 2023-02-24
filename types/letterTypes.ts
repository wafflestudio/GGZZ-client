export type Letter = {
  id: number;
  text: string;
  audio: string;
  image: string;
};

export type LetterRequest = {
  title: string | null;
  text: string | null;
  audio: Blob | null;
  image: Blob | null;
};
