export type Letter = {
  id: number;
};

export type LetterRequest = {
  text: string | null;
  audio: Blob | null;
};
