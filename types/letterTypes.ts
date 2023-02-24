export type Letter = {
  id: number;
  text: string;
  audio: string;
};

export type LetterRequest = {
  title: string | null;
  text: string | null;
  audio: Blob | null;
};
